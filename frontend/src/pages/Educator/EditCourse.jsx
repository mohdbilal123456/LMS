import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";


export default function EditCourse() {
  
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectCourse, setSelectCourse] = useState({});
  const dispatch = useDispatch()
  let {courseData} = useSelector(state => state.course)

  // Fetch course
  const getCourseById = async () => {
    if (!courseId) return;
    try {
      const result = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true,
      });
      setSelectCourse(result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch course");
    }
  };

  useEffect(() => {
    if (!selectCourse) return;
    setTitle(selectCourse.title || "");
    setSubtitle(selectCourse.subTitle || "");
    setDescription(selectCourse.description || "");
    setCategory(selectCourse.category || "");
    setLevel(selectCourse.level || "");
    setPrice(selectCourse.price || "");
    setIsPublished(selectCourse.isPublished || false);
    setThumbnail(selectCourse.thumbNail || null);
  }, [selectCourse]);

  useEffect(() => {
    getCourseById();
  }, []);

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  // ✅ Toggle publish/unpublish
  const togglePublish = () => {
    setIsPublished((prev) => !prev);
  };

  const handleSave = async () => {
    if (!title || !category || !level) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subtitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      formData.append("isPublished", JSON.stringify(isPublished));

      if (thumbnail instanceof File) {
        formData.append("thumbNail", thumbnail);
      }

      const result = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("edit course ", result);
      const updateData = result.data
      if(updateData.isPublished){
        let updateCourses = courseData.map(c => c._id === courseId
          ? updateData:c
        )
        if(!courseData.some(c => c._id === courseId))
        {
          updateCourses.push(updateData)
        }
        dispatch(setCourseData(updateCourses))
      }

      else{
        const filterCourse = courseData.filter(c => c._id !== courseId)
        dispatch(setCourseData(filterCourse)) 
      }
      
      toast.success("Course Updated Successfully!");
      setLoading(false)
      navigate("/courses");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update course");
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoadingRemove(true);
    try {
      await axios.delete(`${serverUrl}/api/course/remove/${courseId}`, {
        withCredentials: true,
      });
      const filterCourse = courseData.filter(c => c._id !== courseId)
      dispatch(setCourseData(filterCourse))
      toast.success("Course Removed Successfully!");
      navigate("/courses");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove course");
    }
    setLoadingRemove(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <FaArrowLeft
              onClick={() => navigate(-1)}
              className="text-gray-700 text-lg cursor-pointer hover:text-black transition"
            />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Edit Course Information
            </h2>
          </div>
          <button
            onClick={() => navigate("/lectures")}
            className="bg-black text-white text-sm px-4 py-2 
            rounded-md hover:bg-gray-800 transition"
            onClick={()=>navigate(`/createlecture/${selectCourse?._id}`)}
          >
            Go to lectures page
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center">
          {/* ✅ Toggle Publish Button */}
          <button
            onClick={togglePublish}
            className={`${
              isPublished ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            } text-white text-sm font-medium px-5 py-2 rounded-md transition`}
          >
            {isPublished ? "Published" : "Unpublished"}
          </button>

          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-md transition"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save Changes"}
          </button>

          <button
            onClick={handleRemove}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-md transition disabled:opacity-70"
            disabled={loadingRemove}
          >
            {loadingRemove ? <ClipLoader size={20} color="white" /> : "Remove Course"}
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
            Course Details
          </h3>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                placeholder="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Category / Level / Price */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Structure and Algorithm">Data Structure and Algorithm</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                <input
                  type="number"
                  placeholder="₹"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="mt-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 w-40 h-40 relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {thumbnail ? (
                <img
                  src={thumbnail instanceof File ? URL.createObjectURL(thumbnail) : thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 16l4-4a2 2 0 012.828 0L15 16m-3-3l3-3a2 2 0 012.828 0L21 13M5 7h.01M12 7h.01M19 7h.01"
                    />
                  </svg>
                  <p className="text-sm text-center">Upload Image</p>
                </div>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="border border-gray-400 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition disabled:opacity-70"
                disabled={loading}
              >
                {loading ? <ClipLoader size={25} color="white" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
