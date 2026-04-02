 import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
 export const verifyJWT=async(req,resizeBy,next)=>{
    try{
      const token=req.cookies?.accessToken 
      if(!token){
        return res.status(401).json({message:"unauthorized request"});
      }
      const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user=await User.findById(decodedToken?._id).select("-password -refreshToken")

     if(!user){
        return res.status(401).json({message:"invalid access Token"});
     }
     req.user=user;
     next();
    } catch(error){
          return res.status(401).json({message:"invalid access Token",error});
    }
 }