import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { serverUrl } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../redux/lectureSlice";

export default function EditLecture() {
      const [lectureTitle, setLectureTitle] = useState("");
      const [video, setVideo] = useState(null);
      const [isFree, setIsFree] = useState(false);
      const [loading, setLoading] = useState(false);
      const { lectureId } = useParams();
      const { lectureData } = useSelector((state) => state.lecture);
      const navigate = useNavigate();
      const dispatch = useDispatch();

      const handleFileChange = (e) => {
            setVideo(e.target.files[0]);
      };

      const handleEditLecture = async (e) => {
            e.preventDefault(); // ✅ Stop page reload

            if (!lectureTitle || !video) {
                  toast.error("Please provide both title and video!");
                  return;
            }

            const formData = new FormData();
            formData.append("lectureTitle", lectureTitle);
            formData.append("videoUrl", video);
            formData.append("isPreviewFree", isFree);

            setLoading(true);
            try {
                  const result = await axios.post(
                        `${serverUrl}/api/course/editlecture/${lectureId}`,
                        formData,
                        { withCredentials: true }
                  );
                  console.log("video response:", result.data);

                  dispatch(setLectureData([...lectureData, result.data]));
                  toast.success("Lecture Updated Successfully!");
                  navigate("/courses");
            } catch (error) {
                  console.error("Error updating lecture:", error);
                  toast.error(error.response?.data?.message || "Error updating lecture");
            } finally {
                  setLoading(false);
            }
      };

      const handleRemoveLecture = async () => {

            try {
                  const result = await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`
                        , { withCredentials: true }
                  )
                  console.log('remove', result)
                  toast.success('Lecture Removed !')
                  navigate(-1)
            }
            catch (error) {
                  console.log(error)
                  toast.error("Something Went Wrong !")
            }
      }

      return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                  <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                              <FaArrowLeft
                                    onClick={() => navigate(-1)}
                                    className="cursor-pointer text-gray-700"
                                    size={18}
                              />
                              <h2 className="text-xl font-semibold text-gray-800">
                                    Update Your Lecture
                              </h2>
                        </div>

                        {/* Remove Button */}
                        <button
                              onClick={handleRemoveLecture}
                              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg mb-4 w-full font-medium"
                        >
                              Remove Lecture
                        </button>

                        {/* Form */}
                        <form onSubmit={handleEditLecture} className="space-y-4">
                              {/* Title */}
                              <div>
                                    <label className="block text-gray-600 mb-1 font-medium">Title</label>
                                    <input
                                          type="text"
                                          value={lectureTitle}
                                          onChange={(e) => setLectureTitle(e.target.value)}
                                          placeholder="Enter Lecture Title"
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                                    />
                              </div>

                              {/* Video Upload */}
                              <div>
                                    <label className="block text-gray-600 mb-1 font-medium">
                                          Video *
                                    </label>
                                    <input
                                          type="file"
                                          accept="video/*"
                                          onChange={handleFileChange}
                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
                                    />
                                    {video && (
                                          <p className="text-sm text-gray-500 mt-1">
                                                Selected: {video.name}
                                          </p>
                                    )}
                              </div>

                              {/* Checkbox */}
                              <div className="flex items-center gap-2">
                                    <input
                                          type="checkbox"
                                          id="isFree"
                                          checked={isFree}
                                          onChange={() => setIsFree(!isFree)}
                                          className="w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor="isFree" className="text-gray-700">
                                          Is this video FREE
                                    </label>
                              </div>

                              {/* Update Button */}
                              <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition ${loading && "opacity-50 cursor-not-allowed"
                                          }`}
                              >
                                    {loading ? "Updating..." : "Update Lecture"}
                              </button>
                        </form>
                  </div>
            </div>
      );
}
