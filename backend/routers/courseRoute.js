import express from 'express'
import { createCourse, createLecture, editCourse, editLecture, getCourseById, 
getCourseLecture, getCreatorById, getCreatorCourses, getPublishCourses, removeCourse, 
removeLecture} from '../controller/courseController.js'
import isAuth from '../middleware/isAuth.js'
import upload from '../middleware/multer.js'
import { searchWithAi } from '../controller/searchController.js'
const courseRouter = express.Router()

//  for course 
courseRouter.post('/create',isAuth,createCourse)
courseRouter.get('/getcreator',isAuth,getCreatorCourses)
courseRouter.post('/editcourse/:courseId',isAuth,upload.single('thumbNail'),editCourse) 
courseRouter.get('/getcourse/:courseId',isAuth,getCourseById)
courseRouter.get('/getpublishcourses',getPublishCourses)
courseRouter.delete('/remove/:courseId',isAuth,removeCourse)


// For Lectures
courseRouter.post('/createlecture/:courseId',isAuth,createLecture)
courseRouter.get('/courselecture/:courseId',isAuth,getCourseLecture)
courseRouter.post('/editlecture/:lectureId',isAuth,upload.single('videoUrl'),editLecture)
courseRouter.delete('/removelecture/:lectureId',isAuth,removeLecture)

// creator

courseRouter.post('/creator',getCreatorById)

//  for search

courseRouter.post('/searchwithai',searchWithAi)

export default courseRouter