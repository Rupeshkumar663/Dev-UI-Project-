import { User } from "../models/user.model.js"
import uploadCloudinary from "../db/cloudinary.js"

export const register=async(req,res)=>{
  try{
    const {username,email,fullname,password}=req.body

    if([username,email,fullname,password].some((field)=>!field || field.trim() === "")) {
      return res.status(400).json({message:"All fields are required"})
    }

    const existedUser=await User.findOne({$or:[{username},{email},{fullname}]})
    if(existedUser){
      return res.status(409).json({ message:"User already exists"})
    }
    const avatarLocalPath=req.files?.avatar?.[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
      coverImageLocalPath=req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
      return res.status(400).json({message:"Avatar file is required"})
    }

    const avatar=await uploadCloudinary(avatarLocalPath)
    const coverImage=coverImageLocalPath? await uploadCloudinary(coverImageLocalPath):null
    if(!avatar){
      return res.status(400).json({ message: "Avatar upload failed" })
    }
  
    const user=await User.create({
      fullname,
      avatar:avatar.url,
      coverImage:coverImage?.url || "",
      email,
      password,
      username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser) {
      return res.status(500).json({message: "Something went wrong while registering user"})
    }
    return res.status(201).json({message:"User registered successfully",user:createdUser})
  } catch(error){
    return res.status(500).json({success:false,message:"Internal server error",error:error.message})
  }
}