import express from 'express'
import { createReview, getAllReviews } from '../controller/reviewController.js'
import isAuth from '../middleware/isAuth.js'
const reviewRouter = express.Router()

reviewRouter.post('/createreview',isAuth,createReview)
reviewRouter.get('/getreviews',getAllReviews)

export default reviewRouter