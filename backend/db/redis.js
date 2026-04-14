import { createClient} from "redis";
import dotenv from "dotenv"
dotenv.config();
let redisClient;
export const connectRedis=async()=>{
    try {
        if(redisClient){
            return redisClient;
        }
        const REDIS_URL=process.env.REDIS_URL;//6379
        if(!REDIS_URL){
            console.log("redis url missing")
            process.exit(1)
        }
        createClient({url:REDIS_URL})
        
        redisClient.on("error",(error)=>{
         console.error("Redis Error:",error);
        });
        redisClient.on("ready",()=>{
         console.log(" redisclient ready");
        });
        await redisClient.connect();
        console.log("Redisclient  Connected to redis Successfully");
        return redisClient;
    } catch(error){
        console.error("Failed to initialize Redis:",error);
        process.exit(1); 
    }
}

