import redisClient from "../config/redis.js";

export const addJob=async(queueName,value)=>{
  await redisClient.lPush(queueName,JSON.stringify(value));
};

export const processJob=async(queueName)=>{
  const data=await redisClient.rPop(queueName);
  if(!data) 
    return null;
  return JSON.parse(data);
};