import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema({
     
      lectureTitle:{
            type:String,
            required:true
      },
      videoUrl:{
            type:String
      },
      isPreviewFree:{
            type:Boolean
      }
      
},{timestamps:true})

const Lecture = new mongoose.model('Lecture',lectureSchema) 
export default Lecture