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
    jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
        }
    )
}
userSchema.methods.generateRefreshToken=function (){}
export const User=mongoose.model("User",userSchema)



//this.password=Rupesh123@
//this.password=bcrypt.hash(this.paassword)=$$$$$$JM(*U(*$#(uhwrfgeivg0erlgi)))