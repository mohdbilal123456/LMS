import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { setSelectedCourse } from "../redux/courseSlice";
import img from '../assets/images/empty.jpg';
import axios from "axios";
import { serverUrl } from "../App";
import Card from "../components/Card";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
// import { useGetAllreviews } from "../customHooks/getAllreviews";


export default function ViewCourses() {

      const { courseId } = useParams();
      const { selectedCourse, courseData } = useSelector(state => state.course);
      console.log('all selectedCurse',selectedCourse)
      const dispatch = useDispatch();
      const navigate = useNavigate()
      const [selectedLecture, setSelectedLecture] = useState(null);
      const [rating, setRating] = useState(0);
      let [creatorData, setCreatorData] = useState(null)
      let [creatorCourses, setCreatorCourses] = useState(null)
      const { userData } = useSelector(state => state.user)
      let [isEnrolled, setIsEnrolled] = useState(false)
      const [comment, setComment] = useState('')
      const [loading, setLoading] = useState(false)

      

      const fetchCourseData = () => {
            const course = courseData?.find(course => course._id === courseId);
            if (course) dispatch(setSelectedCourse(course));
      };

      const handleReviewSubmit = async () => {

            console.log('userData',userData)
            if(!userData || !userData._id)
            {
                  toast.error("please Login to comment")
                  return;
            }

            setLoading(true)
            try {
                  const result = await axios.post(serverUrl + '/api/review/createreview',
                        { rating, comment, courseId }, { withCredentials: true }
                  )
                  setLoading(false)
                  toast.success('Review Added')
                  setRating(0)
                  setComment('')
                  console.log(result.data)
            }
            catch (error) {
                  console.log(error)
                  setLoading(false)
                  toast.error(error.response.data.message)
            }
      };

      const handleEnroll = async (courseId, userId) => {

            if(!userData || !userData._id){
                  toast.error("Please Login to enroll")
                  return;
            }

            try {
                  const orderData = await axios.post(serverUrl + '/api/order/razorpay-order',
                        { userId, courseId }, { withCredentials: true }
                  )
                  console.log(orderData)

                  const options = {
                        key: import.meta.env.VITE_RAZORPAY_API_KEY,
                        amount: orderData.data.amount,
                        currency: "INR",
                        name: "CodeVista Courses",
                        description: "COURSE ENROLLEMENT PAYMENT",
                        order_id: orderData.data.id,
                        handler: async function (response) {
                              console.log('Razorpay Response ', response)

                              try {
                                    const verifyPayment = await axios.post(serverUrl + '/api/order/verifypayment'
                                          , { ...response, courseId, userId }, { withCredentials: true }
                                    )
                                    console.log('verify', verifyPayment)
                                    setIsEnrolled(true)
                                    toast.success("Payment Successfully")
                              }
                              catch (error) {
                                    console.log('Verify Error ', error)
                                    toast.error('Payment Error ')
                              }
                        }
                  }
                  const rzp = new window.Razorpay(options)
                  rzp.open()
            }
            catch (error) {
                  console.log(error)
                  toast.error('Something Went Wrong !')
            }
      }



      useEffect(() => {
            if (creatorData?._id && courseData.length > 0) {
                  const createCourse = courseData.filter((course) => {
                        return course.creators === creatorData?._id && course._id !== courseId
                  })
                  // console.log('crette', createCourse)
                  setCreatorCourses(createCourse)
                  // console.log('cccccc',creatorCourses)
            }
      }, [creatorData, courseData])

      // Fetch creator info once course data is available

      useEffect(() => {
            const getCreator = async () => {
                  if (selectedCourse?.creators) {
                        try {
                              const result = await axios.post(
                                    `${serverUrl}/api/course/creator`,
                                    { userId: selectedCourse?.creators },
                                    { withCredentials: true }
                              );
                              console.log('creator', result.data)
                              setCreatorData(result.data);

                        } catch (error) {
                              console.error("Error fetching creator:", error);
                        }
                  }
            };
            getCreator();
      }, [selectedCourse]);

      useEffect(() => {
            fetchCourseData();
            checkErollment()
      }, [courseData, courseId, userData]);



      useEffect(() => {
            console.log('selectedCourse updated:', selectedCourse);
      }, [selectedCourse]);

      const checkErollment = () => {
            const verify = userData?.enrolledCourses?.some(c =>
                  (typeof c == 'string' ? c : c._id).toString() === courseId?.toString())

            if (verify) {
                  setIsEnrolled(true)
            }
      }

      const calculateReview = (reviews) => {

            if (!reviews || reviews.length == 0) {
                  return 0
            }

            const total = reviews.reduce((sum, review) => sum + review.rating, 0)

            return (total / reviews.length).toFixed(1)
      }
      console.log('scd',selectedCourse?.reviews)
      const avgRating = calculateReview(selectedCourse?.reviews)

      console.log('Avg Rating', avgRating)


      return (
            <div className="min-h-screen bg-gray-50 text-gray-800 px-4 md:px-10 py-10">

                  {/* Top Section */}
                  <div className="flex flex-col lg:flex-row gap-10">
                        {/* Left: Course Preview Image */}
                        <div className="lg:w-1/2">
                              {selectedCourse?.thumbNail ? (
                                    <img
                                          src={selectedCourse.thumbNail}
                                          alt="Course Thumbnail"
                                          className="rounded-2xl shadow-lg object-cover w-full"
                                    />
                              ) : (
                                    <img
                                          src={img}
                                          alt="AI LMS Banner"
                                          className="rounded-2xl shadow-lg object-cover w-full"
                                    />
                              )}
                        </div>

                        {/* Right: Course Info */}
                        <div className="lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-lg p-8 space-y-4">
                              <h2 className="text-2xl font-bold">{selectedCourse?.category}</h2>
                              <div className="flex items-center gap-2 text-yellow-500">
                                    ⭐ <span>{avgRating}</span>
                              </div>
                              <ul className="space-y-2 text-sm">
                                    <li>✅ 10+ hours of video content</li>
                                    <li>✅ Lifetime access to course materials</li>
                              </ul>
                              <span className="text-black text-[18px] md:text-[25px] font-bold my-5">₹ {selectedCourse?.price}/-</span>
                              {/* Enroll Button */}
                              {!isEnrolled ? <button className="bg-[black] text-white px-6 py-2 
                              rounded hover:bg-gray-700 mt-3" onClick={() => handleEnroll(courseId, userData._id)}>
                                    Enroll Now
                              </button>
                                    :
                                    <button className="bg-green-200 text-green-600 px-6 py-2 rounded
                               hover:bg-gray-100 hover:border mt-3"
                                          onClick={() => navigate(`/viewlecture/${courseId}`)} >
                                          Watch Now
                                    </button>
                              }
                        </div>
                  </div>

                  {/* Course Details Section */}
                  <div className="mt-12 grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">

                              {/* ---------------- What You'll Learn ---------------- */}
                              <section>
                                    <h3 className="text-xl font-semibold mb-2">What You’ll Learn</h3>
                                    <ul className="list-disc ml-6 text-gray-600">
                                          <li>✅ Gain practical, hands-on knowledge through real-world projects.</li>
                                          <li>✅ Understand core concepts step by step — from basics to advanced level.</li>
                                          <li>✅ Develop problem-solving and critical thinking skills.</li>
                                          <li>✅ Learn with easy explanations, examples, and guided exercises.</li>
                                          <li>✅ Get lifetime access to course materials and future updates.</li>
                                    </ul>
                              </section>

                              {/* ---------------- Requirements ---------------- */}
                              <section>
                                    <h3 className="text-xl font-semibold mb-2">Requirements</h3>
                                    <p className="text-gray-600">{selectedCourse?.subTitle}</p>
                              </section>


                              {/* ---------------- Who This Course is For ---------------- */}
                              <section>
                                    <h3 className="text-xl font-semibold mb-2">Who This Course is For</h3>
                                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                                          {selectedCourse?.description
                                                ?.split("\n")
                                                .filter(line => line.trim() !== "")
                                                .map((point, index) => (
                                                      <li key={index}>{point.trim()}</li>
                                                ))}
                                    </ul>
                              </section>

                              {/* ---------------- Course Curriculum ---------------- */}

                              <section>
                                    <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
                                    <div className="flex flex-col md:flex-row gap-6">
                                          {/* Lecture List */}
                                          <div className="bg-white shadow rounded-xl p-4 w-full md:w-1/2">
                                                {selectedCourse?.lectures?.length > 0 ? (
                                                      selectedCourse.lectures.map((lecture, index) => {
                                                            const isLocked = !lecture.isPreviewFree && !isEnrolled;
                                                            return (
                                                                  <div
                                                                        key={lecture._id || index}
                                                                        className={`flex items-center gap-3 border-b py-3 rounded-lg px-2 transition ${isLocked
                                                                              ? "cursor-not-allowed opacity-60 blur-[0.5px]"
                                                                              : "cursor-pointer hover:bg-gray-100"
                                                                              }`}
                                                                        onClick={() => !isLocked && setSelectedLecture(lecture)}
                                                                  >
                                                                        <button
                                                                              disabled={isLocked}
                                                                              className={`text-gray-700 text-xl ${isLocked ? "text-gray-400" : ""}`}
                                                                        >
                                                                              {isLocked ? "🔒" : "▶️"}
                                                                        </button>
                                                                        <span className="text-gray-800">{lecture.lectureTitle}</span>
                                                                  </div>
                                                            );
                                                      })
                                                ) : (
                                                      <p className="text-gray-500 text-center py-4">
                                                            No lectures available yet.
                                                      </p>
                                                )}
                                          </div>

                                          {/* Video Player */}
                                          <div className="bg-black rounded-xl w-full md:w-1/2 aspect-video flex items-center justify-center">
                                                {selectedLecture ? (
                                                      <video
                                                            src={selectedLecture.videoUrl}
                                                            controls
                                                            className="w-full h-full rounded-xl"
                                                      />
                                                ) : (
                                                      <p className="text-white text-center px-4">
                                                            Select a preview lecture to watch
                                                      </p>
                                                )}
                                          </div>
                                    </div>
                              </section>

                              {/* ---------------- Reviews Section ---------------- */}
                              <section className="mt-10 bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-semibold mb-4">Student Reviews</h3>

                                    {/* Average Rating */}
                                    <div className="flex items-center gap-2 mb-6">
                                          <span className="text-3xl text-yellow-400">⭐</span>
                                          <span className="text-lg font-medium">{avgRating}</span>
                                          {/* <span className="text-gray-500 text-sm">(Based on 120 reviews)</span> */}
                                    </div>

                                    {/* Add Review Form */}
                                    <div className="border-t pt-4 mt-4">
                                          <h4 className="font-semibold mb-2">Write a Review</h4>
                                          <div className="flex items-center mb-3 gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (

                                                      <FaStar key={star}
                                                            onClick={() => setRating(star)} className={star <= rating ? "fill-yellow-500" : "fill-gray-300"} />

                                                ))}
                                          </div>
                                          <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Write your feedback..."
                                                className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                rows="4"
                                          ></textarea>
                                          <button
                                                onClick={handleReviewSubmit}
                                                className="mt-3 bg-black text-white py-2 px-6 
                                                rounded-lg hover:bg-gray-800 transition"
                                                disabled={loading}
                                          >
                                                {loading ? <ClipLoader /> : 'Submit Review'}
                                          </button>
                                    </div>

                                    {/* Review List */}
                                    <div className="mt-8 space-y-4">
                                          {/* {reviews.length > 0 ? (
                                                reviews.map((rev, index) => (
                                                      <div key={index} className="border-b pb-3">
                                                            <div className="flex items-center gap-2">
                                                                  <div className="text-yellow-400">
                                                                        {"⭐".repeat(rev.rating)}{" "}
                                                                        <span className="text-gray-500 text-sm">({rev.rating})</span>
                                                                  </div>
                                                            </div>
                                                            <p className="text-gray-700 mt-1">{rev.text}</p>
                                                      </div>
                                                ))
                                          ) : (
                                                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                          )} */}
                                    </div>
                              </section>


                        </div>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-t ">
                        {creatorData?.photoUrl ? <img
                              src={creatorData?.photoUrl}
                              alt="Instructor"
                              className="w-16 h-16 rounded-full object-cover"
                        /> : <img
                              src={img}
                              alt="Instructor"
                              className="w-16 h-16 rounded-full object-cover"
                        />
                        }
                        <div>
                              <h3 className="text-lg font-semibold">{creatorData?.name}</h3>
                              <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.description}</p>
                              <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.email}</p>

                        </div>
                  </div>
                  <div>
                        <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator -</p>
                        <div className='w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] '>

                              {
                                    creatorCourses?.map((item, index) => (
                                          <Card
                                                key={index}
                                                id={item._id}
                                                thumbnail={item.thumbNail}
                                                title={item.title}
                                                price={item.price}
                                                category={item.category}
                                                reviews={item.reviews}
                                          />
                                    ))
                              }
                        </div>
                  </div>

            </div>
      );
}
