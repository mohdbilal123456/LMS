import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routers/authRouter.js'
import cors from 'cors'
import userRouter from './routers/userRoute.js'
import courseRouter from './routers/courseRoute.js'
import paymentRouter from './routers/paymentRoute.js'
import reviewRouter from './routers/reviewRoute.js'
dotenv.config()
let app = express()

const port = process.env.PORT || 3000
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
      origin : 'http://localhost:5173',
      credentials : true
}))

app.get('/',(req,res)=>{
      res.send("Hello Server")
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/course',courseRouter)
app.use('/api/order',paymentRouter)
app.use('/api/review',reviewRouter)
app.listen((port),()=>{
      connectDb()
      console.log(`Server is Started at ${port}`)
})