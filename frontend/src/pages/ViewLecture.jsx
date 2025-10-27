import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaPlay, FaVideoSlash } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { serverUrl } from "../App";
import axios from "axios";

function ViewLecture() {
    const { courseId } = useParams();
    const { courseData } = useSelector(state => state.course);
    const { userData } = useSelector(state => state.user);
    const [creatorData, setCreatorData] = useState(null);

    const selectedCourse = courseData?.find(course => course._id === courseId);
    const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null);
    const navigate = useNavigate();

    useEffect(() => {
        const getCreator = async () => {
            if (selectedCourse?.creators) {
                try {
                    const result = await axios.post(
                        `${serverUrl}/api/course/creator`,
                        { userId: selectedCourse?.creators },
                        { withCredentials: true }
                    );
                    console.log('creator lecture', result.data);
                    setCreatorData(result.data);
                } catch (error) {
                    console.error("Error fetching creator:", error);
                }
            }
        };
        getCreator();
    }, [selectedCourse]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row justify-center items-start p-6 gap-6">
            {/* Left Section */}
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col">
                {/* Back & Course Title */}
                <div className="flex items-center gap-3 mb-2">
                    <FaArrowLeftLong
                        className="text-xl cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h2 className="text-2xl font-semibold">
                        {selectedCourse?.title}
                    </h2>
                </div>

                {/* Course Info */}
                <div className="flex gap-6 text-gray-600 text-sm mb-4">
                    <p>
                        <span className="font-medium text-black">Category: </span>
                        {selectedCourse?.category}
                    </p>
                    <p>
                        <span className="font-medium text-black">Level: </span>
                        {selectedCourse?.level}
                    </p>
                </div>

                {/* Video Section */}
                {selectedLecture?.videoUrl ? (
                    <video
                        className="w-full rounded-xl shadow-md mb-3"
                        src={selectedLecture.videoUrl}
                        controls
                    />
                ) : (
                    <div className="flex flex-col justify-center items-center h-[350px] bg-gray-100 rounded-xl shadow-md mb-3 border border-dashed border-gray-300">
                        <FaVideoSlash className="text-gray-400 text-6xl mb-4" />
                        <p className="text-gray-600 text-xl font-semibold">
                            Please select a lecture to watch
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            All lectures will appear on the right
                        </p>
                    </div>
                )}

                {/* Lecture Title */}
                <div className="mt-2">
                    <p className="text-[27px] font-semibold text-gray-700">
                        {selectedLecture?.title || selectedCourse?.title}
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-[380px] bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">All Lectures</h3>

                <div className="flex flex-col gap-3 mb-6">
                    {selectedCourse?.lectures?.map((lec, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedLecture(lec)}
                            className={`flex justify-start items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition 
                                ${selectedLecture === lec ? "bg-gray-200 shadow-inner" : "hover:bg-gray-100"}`}
                        >
                            <FaPlay className={`text-gray-600 text-lg ${selectedLecture === lec ? "text-blue-600" : ""}`} />
                            <span className={`font-medium ${selectedLecture === lec ? "text-blue-600" : "text-gray-700"}`}>
                                {lec?.lectureTitle}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Instructor Section */}
                <h3 className="text-lg font-semibold mb-3">Instructor</h3>
                <div className="flex items-center gap-3">
                    <img
                        src={creatorData?.photoUrl || "https://avatars.githubusercontent.com/u/1?v=4"}
                        alt="instructor"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold">{creatorData?.name || "Ankush Sahu"}</p>
                        <p className="text-gray-500 text-sm">{creatorData?.role || "CSE Student"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewLecture;
