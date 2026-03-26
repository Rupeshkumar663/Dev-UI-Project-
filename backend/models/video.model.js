import mongoose, { Schema } from "mongoose";
const videoSchema=mongoose.Schema({
        videoFile:{
            type:String,//cloudinary and Multer
            required:true,
        },
        thumbnail:{
            type:String,//cloudinary and Multer
            required:true,
        },
        title:{
             type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,
            required:true,
        },
        views:{
            type:Number,
            default:0,
        },
        isPublished:{
            type:Boolean,
            default:false,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    
},{TimeStamps:true})
export const Video=mongoose.model("Video",videoSchema)