import express from "express"//express-framework-node.js
import dotenv from "dotenv"
import connectDb from "./db/db.js"
import app from "./app.js"
dotenv.config()

connectDb();//async
const PORT=process.env.PORT||5000
app.get("/",(req,res)=>{
     res.send("server connected");
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
}) 






/*
import express from "express"
import dotenv from "dotenv"
import connectDb from "./db/db.js"
dotenv.config()
const app=express()
const PORT=process.env.PORT||5000
connectDb();//promise
.then(()=>{
     app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
     })
})
.catch((error)=>{
    console.error("MongoDB Connection Failed:", error.message);
})
*/