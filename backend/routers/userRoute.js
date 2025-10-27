import express from 'express'
import { getCurrentUser, removePhoto, updateProfile } from '../controller/userController.js'
import isAuth from '../middleware/isAuth.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.get('/getcurrentuser',isAuth,getCurrentUser)
userRouter.post('/updateprofile',isAuth,upload.single('photoUrl'),updateProfile)
userRouter.delete('/removephoto',isAuth,removePhoto)
export default userRouter