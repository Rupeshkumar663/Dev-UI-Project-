import mongoose from "mongoose";//mongoose-tool
import dotenv from "dotenv";//package

dotenv.config();
const connectDb=async()=>{
  try {
    const conn=await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected`);
  } catch(error){
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
export default connectDb;
