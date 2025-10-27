import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice';
import { toast, Zoom } from 'react-toastify';
import { FaTrash } from "react-icons/fa";

export default function EditProfile() {

      let [loading, setLoading] = useState(false)
      let navigate = useNavigate()
      let { userData } = useSelector(state => state.user)
      let [photoUrl, setPhotoUrl] = useState(null)
      const [previewUrl, setPreviewUrl] = useState('') // Blob URL for preview
      let [name, setName] = useState(userData.name || "")
      let [description, setDescription] = useState(userData.description || "")
      let dispatch = useDispatch()

      const handleFileChange = (e) => {
            const file = e.target.files[0]
            setPhotoUrl(file)

            if (file) {
                  const url = URL.createObjectURL(file)
                  setPreviewUrl(url)
            }
      }
      useEffect(() => {
            return () => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl)
            }
      }, [previewUrl])

      const updateProfile = async () => {
            setLoading(true)

            try {
                  let form = new FormData();
                  form.append('name', name);
                  form.append('description', description || ''); // ensure string
                  if (photoUrl === null) {
                        // Do nothing → keep previous photo
                  } else if (photoUrl === '') {
                        form.append('photoUrl', ''); // remove photo
                  } else {
                        form.append('photoUrl', photoUrl); // file object
                  }

                  const result = await axios.post(
                        `${serverUrl}/api/user/updateprofile`,form,
                        {withCredentials: true,}
                  );


                  console.log('update', result.data)
                  dispatch(setUserData(result.data))
                  toast.success('Your Profile is updated', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Zoom,
                  });

                  navigate('/')
                  setLoading(false)
            }
            catch (error) {
                  toast.error('Something Went Wrong', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Zoom,
                  });
                  setLoading(false)
                  console.log(error)
            }

      }

      const removePhoto = async () => {
            alert('Are You Sure Yo Want to Remove profile Image ?')
            try {
                  const result = await axios.delete(`${serverUrl}/api/user/removephoto`, { withCredentials: true });
                  console.log(result)
                  // Clear local state
                  setPhotoUrl('');
                  setPreviewUrl('');

                  // Clear Redux state properly
                  dispatch(setUserData(result.data.user));

                  toast.success('Photo removed successfully');
            } catch (error) {
                  console.log(error);
                  toast.error('Failed to remove photo');
            }
      };


      useEffect(() => {
            // triggers Nav re-render when userData changes
      }, [userData]);

      return (
            <>
                  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
                              <FaArrowLeftLong className='absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/profile")} />
                              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>

                              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                    <div className='w-24 h-24 rounded-full flex items-center justify-center border-2 bg-black text-white cursor-pointer'>
                                          {previewUrl ? (
                                                <img src={previewUrl} className="w-24 h-24 rounded-full object-cover border-4 border-black" />
                                          ) : userData?.photoUrl ? (
                                                <img src={userData.photoUrl} className="w-24 h-24 rounded-full object-cover border-4 border-black" />
                                          ) : (
                                                <span>{userData?.name?.slice(0, 1).toUpperCase()}</span>
                                          )}
                                    </div>


                                    <div className='relative'>
                                          <label className="text-sm font-medium text-gray-700">
                                                Select Avatar
                                          </label>
                                          <input
                                                type="file"
                                                name="photoUrl"
                                                placeholder="Photo URL"
                                                className="w-full px-4 py-2 border rounded-md text-sm "
                                                onChange={handleFileChange}

                                          />
                                          {
                                          (previewUrl || userData?.photoUrl) && (
                                                <FaTrash
                                                      className="absolute top-7.5 right-2 text-red-600 cursor-pointer"
                                                      size={20}
                                                      onClick={removePhoto}
                                                      title="Remove selected photo"
                                                />
                                          )
                                          }
                                    </div>
                                    {/* Name */}
                                    <div>
                                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                                          <input
                                                type="text"
                                                name="name"

                                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[black] placeholder:text-black"
                                                placeholder={userData.name}
                                                onChange={(e) => setName(e.target.value)}
                                                value={name}
                                          />
                                    </div>

                                    {/* Email (read-only) */}
                                    <div>
                                          <label className="text-sm font-medium text-gray-700">Email</label>
                                          <input
                                                type="email"

                                                readOnly
                                                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 placeholder:text-black"
                                                placeholder={userData.email}
                                          />
                                    </div>
                                    {/* Description */}
                                    <div>
                                          <label className="text-sm font-medium text-gray-700">Description</label>
                                          <textarea
                                                name="description"

                                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[black]"
                                                rows={3}
                                                placeholder="Tell us about yourself"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}

                                          />
                                    </div>

                                    {/* Save Button */}
                                    <button
                                          type="submit"
                                          className="w-full bg-[black] active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer"
                                          disabled={loading} onClick={updateProfile}
                                    >
                                          {loading ? <ClipLoader size={30} color='white' /> : "Save Changes"}
                                    </button>
                              </form>

                        </div>
                  </div>

            </>
      )
}
