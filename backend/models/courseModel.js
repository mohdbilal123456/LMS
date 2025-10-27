import mongoose from 'mongoose'


const courseSchema = new mongoose.Schema({

      title :{
            type : String,
            required:true
      },
      subTitle:{
            type:String
      },
      description:{
            type:String
      },
      category:{
            type:String,
            required:true
      },
      level:{
            type:String,
            enum:['Beginner',"Intermediate","Advanced"]
      },
      price:{
            type:Number
      },
      thumbNail:{
            type:String
      },
      enrolledStudent:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
      }],
      lectures:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
      }],
      creators:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
      },
      isPublished:{
            type:Boolean,
            default:false
      },
      reviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
      }]
},{timestamps:true})

const Course = new mongoose.model('Course',courseSchema)

export default Course