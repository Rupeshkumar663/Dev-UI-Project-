import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import {generateAccessToken,generateRefreshToken} from "jsonwebtoken"
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
 userSchema.pre("save",async function(next){
 if(this.isModified("password")){
   this.password=bcrypt.hash(this.paassword)
   next();
  }
   next();
})

userSchema.methods.generateAccessToken=function (){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expireIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function (){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.REFRESH_tOKEN_SECRET,
        {
            expireIn:process.env.REFRESH_tOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)
