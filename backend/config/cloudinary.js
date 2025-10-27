import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
// fs → Node.js ka File System module (local files read, write, delete karne ke liye).
const uploadImage = async (filepath) => {
      try {
            cloudinary.config({
                  cloud_name: process.env.CLOUDINARY_NAME,
                  api_key: process.env.CLOUDINARY_API_KEY,
                  api_secret: process.env.CLOUDINARY_SECRET_KEY
            })
            if (!filepath) {
                  return null
            }
            const uploadResult = await cloudinary.uploader.upload(filepath,{resource_type:'auto'})
            if (fs.existsSync(filepath)) {
                  fs.unlinkSync(filepath)
            }
            // Ye local system se file ko delete kar deta hai after upload.
            // console.log('upload Result',uploadResult.secure_url)
            return uploadResult.secure_url
      }
      catch (error) {
            if (filepath && fs.existsSync(filepath)) {
                  fs.unlinkSync(filepath);
            }
            console.error("Cloudinary upload error:", error);
            console.log(error)
      }
}

export default uploadImage