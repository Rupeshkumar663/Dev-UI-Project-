import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRoutes from "./routes/user.route.js"
import dotenv from "dotenv"
dotenv.config()
const app=express()//configure=setup
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended: true }))
app.use("/api/users",userRoutes)

export default app