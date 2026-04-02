import mongoose from "mongoose";

const subscriptionsSchema=mongoose.Schema({
    subscriber:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
   channel:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
},{timestamp:true})
export const Subscriptions=mongoose.model("Subscriptions",subscriptionsSchema)