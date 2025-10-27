import { getCurrentUser, googleAuth, Login, LogOut, resetPassword, sendOtp, signUp, verifyOtp } from "../controller/authController.js"
import express from 'express'
import isAuth from "../middleware/isAuth.js"

const authRouter = express.Router()

authRouter.post('/signup',signUp)
authRouter.post('/login',Login)
authRouter.get('/logout',LogOut)
authRouter.get("/me", getCurrentUser);
authRouter.post('/sendotp',sendOtp)
authRouter.post('/verifyotp',verifyOtp)
authRouter.post('/resetpassword',resetPassword)
authRouter.post('/googleauth',googleAuth)
export default authRouter
