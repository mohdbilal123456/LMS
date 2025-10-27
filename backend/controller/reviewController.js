import Course from '../models/courseModel.js'
import Review from '../models/reviewModel.js'


export const createReview = async(req,res)=>{

      try {
         const {rating,comment,courseId} = req.body

         console.log('rate',req.body)
         
         const userId = req.userId

         const course = await Course.findById(courseId)

         if(!course){
            return res.status(400).json({message:'Course is not found'})
         }

         const alreadyReviewed = await Review.findOne({course:courseId,user:userId})

         if(alreadyReviewed)
         {
            return res.status(400).json({message : 'You Have Already Reviewed this Course'})
         }

         const review = new Review ({
            course : courseId,
            user:userId,
            rating,
            comment
         })
         console.log('re',review)
         await review.save()
         course.reviews = [...course.reviews,review._id]
         
         await course.save()
         
          
         return res.status(201).json(review)

      } 
      catch (error) {
            return res.status(500).json({message : `Failed to Create review ${error}`})
      }
}


export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name email photoUrl") // populate only user info
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: `Failed to get reviews: ${error.message}` });
  }
};


export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name email photoUrl") // Populate user name & photo
      .sort({ reviewedAt: -1 }); // Optional: latest first

    return res.status(200).json(
      reviews
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
