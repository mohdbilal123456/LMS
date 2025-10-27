import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../redux/lectureSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

export default function CreateLecture() {
      const navigate = useNavigate();
      const { courseId } = useParams();
      const dispatch = useDispatch();
      const { lectureData } = useSelector((state) => state.lecture);

      const [lectureTitle, setLectureTitle] = useState("");
      const [loading, setLoading] = useState(false);
      const [editingLecture, setEditingLecture] = useState(null); // for edit mode
      const [editingTitle, setEditingTitle] = useState("");

      // Fetch lectures on component mount
      useEffect(() => {
            const getCourseLecture = async () => {
                  try {
                        const result = await axios.get(
                              `${serverUrl}/api/course/courselecture/${courseId}`,
                              { withCredentials: true }
                        );
                        console.log("Lectures fetched from server:", result.data.lectures);
                        dispatch(setLectureData(result.data.lectures)); // ✅ use `lectures`, not `lecture`
                  } 
                  catch (error) {
                        console.error(error);
                  }
            };
            getCourseLecture();
      }, [courseId, dispatch]);


      // Create lecture
      const handleCreateLecture = async () => {
            if (!lectureTitle.trim()) return alert("Please enter a lecture title");
            setLoading(true);
            try {
                  const result = await axios.post(
                        `${serverUrl}/api/course/createlecture/${courseId}`,
                        { lectureTitle: lectureTitle.trim() },
                        { withCredentials: true }
                  );
                  dispatch(setLectureData(result.data.lectures)); // ✅ ensures consistency

                  setLectureTitle("");
                  toast.success("Lecture Added");
            } catch (error) {
                  console.error(error);
                  toast.error(error.response?.data?.message || "Something went wrong");
            } finally {
                  setLoading(false);
            }
      };

      // Start editing a lecture
      const handleEditLecture = (lecture) => {
            setEditingLecture(lecture);
            setEditingTitle(lecture.lectureTitle);
      };

     

      return (
            <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10 px-4">
                  <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                              {editingLecture ? "Edit Lecture" : "Let’s Add a Lecture"}
                        </h1>
                        <p className="text-gray-600 mb-6">
                              {editingLecture
                                    ? "Update the lecture title below."
                                    : "Enter the title and add your video lectures to enhance your course content."}
                        </p>

                        <input
                              type="text"
                              placeholder="e.g. Introduction to Mern Stack"
                              value={editingLecture ? editingTitle : lectureTitle}
                              onChange={(e) =>
                                    editingLecture
                                          ? setEditingTitle(e.target.value)
                                          : setLectureTitle(e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 mb-5 focus:outline-none focus:ring-2 focus:ring-black/60"
                        />

                        <div className="flex items-center gap-3 mb-8">
                              <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-800 font-medium"
                              >
                                    <FaArrowLeft /> Back to Course
                              </button>

                              {editingLecture ? (
                                    <button
                                          className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-medium"
                                          disabled={loading}
                                    >
                                          {loading ? <ClipLoader color="white" size={20} /> : "Update Lecture"}
                                    </button>
                              ) : (
                                    <button
                                          onClick={handleCreateLecture}
                                          className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-medium"
                                          disabled={loading}
                                    >
                                          {loading ? <ClipLoader color="white" size={20} /> : "+ Create Lecture"}
                                    </button>
                              )}
                        </div>

                        <div className="space-y-3">
                              {lectureData?.map((lecture, index) => (
                                    <div
                                          key={lecture._id || index}
                                          className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-3 transition"
                                    >
                                          <p className="text-gray-800 font-medium">
                                                Lecture - {index + 1}: {lecture.lectureTitle}
                                          </p>
                                          <button
                                                className="text-gray-600 hover:text-gray-900"
                                                onClick={() => handleEditLecture(lecture)}
                                          >
                                          <FaEdit className="cursor-pointer"
                                          onClick={()=>navigate(`/editlecture/${courseId}/${lecture._id}`)} size={18} />
                                          </button>
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
}
