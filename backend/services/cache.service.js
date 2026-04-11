import redisClient from "../config/redis.js";

//get cache----------------------------------------
export const getCache=async(key)=>{//redis-key
  try {
    const data=await redisClient.get(key);
    if(!data){
      console.log(`Cache MISS:${key}`);
      return null;
    }
    console.log(`Cache HIT:${key}`);
    return JSON.parse(data);
  } catch(error){
    console.error("Redis GET Error:",error.message);
    return null;
  }
};


//set cache----------------------------------------
export const setCache=async(key,value,ttl=60)=>{
  try{
    await redisClient.set(key,JSON.stringify(value),{EX:ttl});
    console.log(`Cache SET:${key} (TTL:${ttl}s)`);
  } catch(error){
    console.error("Redis SET Error:", error.message);
  }
};

//delete cache----------------------------------------
export const deleteCache=async(key)=>{
  try{
    await redisClient.del(key);
    console.log(`Cache DELETED:${key}`);
  } catch(error){
    console.error("Redis DELETE Error:", error.message);
  }
};