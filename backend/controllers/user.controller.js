import { User } from "../models/user.model.js"
import uploadCloudinary from "../db/cloudinary.js"
import jwt from "jsonwebtoken"
const generateAccessAndRefreshTokens=async(userId)=>{
  try{
     const user=await User.findById(userId)
     const accesstoken=user.generateAccessToken();
     const refreshtoken=user.generateRefreshToken();
     user.refreshToken=refreshtoken;
     await user.save();
     return {accesstoken,refreshtoken};
  } catch(error){
    return res.status(500).json({message:"something went wrong while generating refresh and access token"});
  }
}

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

export const loginUser=async(req,res)=>{
  //req body->data
  //username or email
  //find user
  //password check
  //access and refresh
  //send cookie

  const {email,username,password}=req.body;
  if(!email || !username ||!password ){
     return res.status(402).json({message:"username or email is required"});
  }

  const user=await User.findOne({
    $or:[{username},{email}]
  });
  if(!user){
    return res.status(404).json({message:"user does not exist"});
  }

   const isPasswordValid=await user.isPasswordCorrect(password);
   if(!isPasswordValid){
    return res.status(404).json({message:"Invalid user password"});
   }
   const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);
   const loggedIn=User.findById(user._id).select("-password -refreshToken")

   const options={
    httpOnly:true,
    secure:true
   }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
   .json({message:"User logged in successfully",user:loggedIn,accessToken,refreshToken});
} 

export const logoutUser=async(req,res)=>{
  User.findByIdAndUpdate(
        req.user._id,{
          $set:{
            refreshToken:undefined
          }
        }
  )

  const options={
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json("logout successfully")
}

export const refreshaccessToken=async(req,res)=>{
  try {
      const incommingrefreshToken=req.cookies.refreshToken ||req.body.refreshToken
     if(!incommingrefreshToken){
        return res.status(401).json({message:"unauthorized request"});
     }
     
     const decodedToken=jwt.verify(incommingrefreshToken,process.env.REFRESH_tOKEN_SECRET)

     const user=User.findById(decodedToken?._id)
     if(!user){
        return res.status(401).json({message:"Invalid refresh token"});
     }

    if(incommingrefreshToken!==user?.refreshToken){
      return res.status(401).json({message:"refresh Token is expired or used"});
    }
    options={
      httpOnly:true,
      secure:true
    }
   await generateAccessAndRefreshTokens(user?._id)
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({accessToken,refreshToken})
  } catch(error){
    return res.status(401).json({message:"refresh Token is expired or used"});
  }
} 


 export const ChangeCurrentPassword=async(req,res)=>{
   try{
    const {oldpassword,newpassword,confirmpassword}=req.body
     if(!oldpassword){
      return res.status(401).json({message:"please fill old password"});
     }
     if(confirmpassword!=newpassword){
      return res.status(401).json({message:"confirm password is not correct"});
     }
    const passwordcorrect=await isPasswordCorrect(oldpassword)
    if(!passwordcorrect){
       return res.status(401).json({message:"please fill  correct old password"});
    }
    const user=User.findById(req.user?._id)
    if(!user){
       return res.status(401).json({message:"user is not found"});
    }
    user.password=newpassword
    await user.save({validateBeforeSave:false})
    return res.status(200).json({message:"password changed successfully"})
   }catch(error){
    return res.status(200).json({message:"Invalid password",error})
   }
 }

 export const getCurrentUser=async(req,res)=>{
  try{
     const user=req.user
     return res.status(200).json({message:"current user fetched successfully",user})
  } catch(error){
     return res.status(200).json({message:"current user not fetched ",error})
  }
 }

export const updateaccountDetails=async(req,res)=>{
  try{
    const {fullName,email}=req.body
    if(!fullName ||! email){
      return res.status(401).json({message:"required fullname and email"})
    }
   const user= User.findByIdAndUpdate(
      req.user?._id,
    {
       $set:{
        fullname:fullName,
        email:email
       }
    },
    {new:true}
  ).select("-paasword")
   
  res.status(200).json({message:"Account details updated successfully"});
  } catch(error){
     res.status(200).json({message:"server issue"});
  }
}

export const updateuseravtar=async(req,res)=>{
   try {
    const avatarlocalpath=req.file?.path
   if(!avatarlocalpath){
    return res.status(400).json({message:"avtar file is missing"})
   }
   const avatar=await uploadCloudinary(avatarlocalpath)
    if(!avatar.url){
    return res.status(400).json({message:"error while uploading on avatar"})
   }

   User.findByIdAndUpdate(
    req.user._id,
    {
       $set:{
        avatar:avatar.url
       }
    },
    {new:true}).select("-password")
    return res.status(200).json({meesage:"Avatar updated successfully"})
   } catch(error){
    return res.status(200).json({meesage:"server Issue",error})
   }
}

export const updateuserCoverImage=async(req,res)=>{
   try {
    const CoverImagelocalpath=req.file?.path
   if(!CoverImagelocalpath){
    return res.status(400).json({message:"avtar file is missing"})
   }
   const coverImage=await uploadCloudinary(CoverImagelocalpath)
    if(!coverImage.url){
    return res.status(400).json({message:"error while uploading on coverImage"})
   }

   User.findByIdAndUpdate(
    req.user._id,
    {
       $set:{
        coverImage:coverImage.url
       }
    },
    {new:true}).select("-password")
    return res.status(200).json({meesage:"coverImage updated successfully"})
   } catch(error){
    return res.status(200).json({meesage:"server Issue",error})
   }
}