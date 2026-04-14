import express from "express";
import { loginUser, logoutUser, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Ratelimiter } from "../middlewares/Ratelimiter.middleware.js";

const router = express.Router();

router.post("/register",upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]),register);

router.post("/login",Ratelimiter,loginUser)
router.post("/logout",verifyJWT,logoutUser)
export default router;