import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
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
export const User=mongoose.model("User",userSchema)

asserts

//this.password=Rupesh123@
//this.password=bcrypt.hash(this.paassword)=$$$$$$JM(*U(*$#(uhwrfgeivg0erlgi)))