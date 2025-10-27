import React from 'react';
import { useSelector } from 'react-redux';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function MyEnrolledCourses() {
    const { userData } = useSelector(state => state.user);
    const { courseData } = useSelector(state => state.course);
    const navigate = useNavigate();

    // Map IDs to full course objects
    const enrolledCoursesFull = userData.enrolledCourses?.map(courseId => courseData.find(c => c._id === courseId))
        .filter(Boolean); // remove undefined if course not found

    return (
        <div className="min-h-screen w-full px-4 py-9 bg-gray-50 relative">
            <FaArrowLeftLong
                className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer'
                onClick={() => navigate("/")}
            />

            <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
                My Enrolled Courses
            </h1>

            {
            enrolledCoursesFull?.length === 0 ? (
                <p className="text-gray-500 text-center w-full">
                    You haven’t enrolled in any course yet.
                </p>
            ) : (
                <div className="flex items-center justify-center flex-wrap gap-[30px]">
                    {enrolledCoursesFull?.map((course) => (
                        <div
                            key={course._id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden border"
                        >
                            <img
                                src={course?.thumbNail}
                                alt={course.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {course?.title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-2">
                                    {course?.category}
                                </p>
                                <p className="text-sm text-gray-700">
                                    {course?.level}
                                </p>
                                <button
                                    className='px-[10px] text-center py-[10px] border-2 
                                        bg-black border-black text-white rounded-[10px] text-[15px] 
                                        font-light flex items-center justify-center gap-2 cursor-pointer mt-[10px]
                                        hover:bg-gray-600 w-full'
                                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                                >
                                    Watch Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyEnrolledCourses;
