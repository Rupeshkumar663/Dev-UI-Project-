import { RedisClient} from "../db/redis"
export const Ratelimiter=async(req,res,next)=>{
    try {
     const ip=req.ip
     const key=`${req.user?._id || ip.path}`;
     const count=RedisClient.incr(key)

     if(count==1){
       await RedisClient.expire(key,60)
     }
     if(count>5){
        return res.status(401).json({message:"try after some time"})
     }
     if(count<=5){
          next()
     }
    } catch(error){
        return res.status(401).json({message:"server"})
    }

}