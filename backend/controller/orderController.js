import razorpay from 'razorpay'
import dotenv from 'dotenv'
import Course from '../models/courseModel.js'
import User from '../models/userModel.js'
dotenv.config()

const RazorPayInstance = new razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET_KEY
})

export const RazorpayOrder = async (req, res) => {
      try {
            let { courseId } = req.body
            const course = await Course.findById(courseId)

            if (!course) {
                  return res.status(404).json({ message: "Course is not Found" })
            }

            const options = {
                  amount: course.price * 100,
                  currency: 'INR',
                  receipt: `${courseId}.toString()`
            }

            const order = await RazorPayInstance.orders.create(options)

            return res.status(200).json(order)
      }
      catch (error) {
            console.log(error)
            res.status(500).json({ message: "Failed to Create Order" });
      }
}

export const verifyPayment = async (req, res) => {
  try {
    const { courseId, userId, razorpay_order_id } = req.body;
    const orderInfo = await RazorPayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid') {
      const user = await User.findById(userId);
      const course = await Course.findById(courseId).populate('lectures');

      if (!user) return res.status(404).json({ message: "User not found" });
      if (!course) return res.status(404).json({ message: "Course not found" });

      // initialize arrays if undefined
      if (!Array.isArray(user.enrolledCourses)) user.enrolledCourses = [];
      if (!Array.isArray(course.enrolledStudent)) course.enrolledStudent = [];

      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      if (!course.enrolledStudent.includes(userId)) {
        course.enrolledStudent.push(userId);
        await course.save();
      }

      return res.status(200).json({ message: "Payment verified & enrolled successfully!" });
    } else {
      return res.status(400).json({ message: "Failed to verify payment" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error while verifying payment!" });
  }
};
