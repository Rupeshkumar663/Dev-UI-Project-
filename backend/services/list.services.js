import redisClient from "../config/redis.js";

// Add item
export const addToList=async(key,value)=>{
  await redisClient.rPush(key,JSON.stringify(value));
};

// Get all items
export const getList=async(key)=>{
  const data=await redisClient.lRange(key,0,-1);
  return data.map((item)=>JSON.parse(item));
};

//  Remove item left
export const popFromList=async(key)=>{
  const data=await redisClient.lPop(key);
  return data?JSON.parse(data):null;
};