import mongoose from "mongoose";
import dotenv from 'dotenv'
const connectDb = async()=>{
      try {
           await mongoose.connect(process.env.MONGODBURL)
           console.log("Connect DB")
      } 
      catch (error) {
            console.log('DB Error !!')
      }
}

export default connectDb