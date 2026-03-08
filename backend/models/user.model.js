import mongoose, { Schema } from "mongoose"
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    avatar:{
        type:String, //cloudinary or multer
        required:true,
    },
    coverImage:{
        type:String, //cloudinary or multer
    },
    watchHistory:{
      type:Schema.Types.ObjectId,
      ref:"Video",
    },
    paassword:{
         type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    refreshToken:{
        type:string
    }

},{timeStamps:true})
export const User=mongoose.model("User",userSchema)