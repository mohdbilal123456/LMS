import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { toast, Zoom } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

export default function ForgetPassword() {

      let [step, setStep] = useState(1)
      let [email, setEmail] = useState('')
      let [otp, setOtp] = useState('')
      let [newPassword, setNewPassword] = useState('')
      let [conPassword, setConPassword] = useState('')
      let [loading, setLoading] = useState(false)

      let navigate = useNavigate()

      const sendOtp = async () => {
            setLoading(true)
            try {
                  const result = await axios.post(serverUrl + '/api/auth/sendotp', { email },
                        { withCredentials: true }
                  )
                  console.log(result)
                  setStep(2)
                  setLoading(false)
                  toast.success(result.data.message, {
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
            }
            catch (error) {
                  toast.error(error.response.data.message, {
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

      // step 2

      const handleStep2 = async () => {
            if (!otp || otp.trim().length === 0) {
                  toast.error("Please enter OTP");
                  return;
            }
            setLoading(true)
            try {
                  const result = await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true })
                  console.log(result)
                  toast.success(result.data.message, {
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
                  setStep(3)
            } catch (error) {
                  toast.error(error.response.data.message, {
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
            }

      }
      // Step 3

      const resetPassword = async () => {
            setLoading(true)
            try {
                  if (newPassword != conPassword) {
                        return toast.error('Password Not Matched')
                  }
                  const result = await axios.post(serverUrl + '/api/auth/resetpassword',
                        { email, password: newPassword }
                  )
                  setLoading(false)
                  navigate('/login')
                  toast.success(result.data.message, {
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
            }
            catch (error) {
                  toast.error(error.response, {
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

      return (
            <>
                  <div className='min-h-screen flex items-center 
            justify-center bg-gray-100 px-4 '>
                        {/* Step 1 */}

                        {
                              step == 1
                              &&
                              <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                                          Foget Your Password
                                    </h2>

                                    <form onSubmit={(e) => e.preventDefault()} action="">
                                          <label htmlFor=""
                                                className='block text-sm font-medium text-gray-700'>
                                                Enter Your Email Address
                                          </label>
                                          <input
                                                type="email"
                                                id='email'
                                                className="mt-1 w-full px-4 py-2 border border-gray-300
                                          rounded-md shadow-sm focus:outline-none focus:ring-2
                                          focus:ring-[black]"
                                                placeholder="you@example.com"
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                required
                                          />
                                          <button type='submit'
                                                className='w-full mt-2 bg-[black] hover:bg-[#4b4b4b] text-white 
                                    py-2 px-4 rounded-md font-medium cursor-pointer'
                                                onClick={sendOtp} disabled={loading}>
                                                {
                                                      loading ? <ClipLoader color='white' size={30} />
                                                            : "Send OTP "
                                                }
                                          </button>

                                          <div className="text-sm text-center mt-4"
                                                onClick={() => navigate("/login")} >
                                                Back to Login
                                          </div>
                                    </form>

                              </div>
                        }

                        {/* Step 2 */}

                        {step == 2 && <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
                              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                                    Enter OTP
                              </h2>


                              {/* OTP Inputs */}

                              <form className="space-y-4">
                                    <div>
                                          <label className="block text-sm font-medium text-gray-700">
                                                Please enter the 4-digit code sent to your email.
                                          </label>
                                          <input
                                                type="text"
                                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]"
                                                placeholder="Enter Here"
                                                onChange={(e) => setOtp(e.target.value)}

                                                value={otp}
                                                required
                                          />
                                    </div>

                                    <button
                                          type="submit"
                                          className="w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer"
                                          disabled={loading} onClick={handleStep2}
                                    >
                                          {loading ? <ClipLoader size={30} color='white' /> : "Verify OTP"}
                                    </button>
                              </form>


                              <div className="text-sm text-center mt-4" onClick={() => navigate("/login")} >

                                    Back to Login

                              </div>




                        </div>}

                        {/* Step 3 */}

                        {
                              step == 3
                              &&
                              <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                                          Reset Your Password
                                    </h2>

                                    <p className='text-sm text-gray-500 text-center mb-6 ' >
                                          Enter a new password below to regain access to your account.
                                    </p>

                                    <form onSubmit={(e) => e.preventDefault()} action="">
                                          <label htmlFor=""
                                                className='block text-sm font-medium text-gray-700'>
                                                New Password
                                          </label>
                                          <input
                                                type="text"
                                                id='newPassword'
                                                className="mt-1 w-full px-4 py-2 border border-gray-300
                                          rounded-md shadow-sm focus:outline-none focus:ring-2
                                          focus:ring-[black]"
                                                placeholder="********"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                value={newPassword}
                                                required
                                          />
                                          <label htmlFor=""
                                                className='block text-sm font-medium text-gray-700'>
                                                Confirm Password
                                          </label>
                                          <input
                                                type="text"
                                                id='password'
                                                className="mt-1 w-full px-4 py-2 border border-gray-300
                                          rounded-md shadow-sm focus:outline-none focus:ring-2
                                          focus:ring-[black]"
                                                placeholder="********"
                                                onChange={(e) => setConPassword(e.target.value)}
                                                value={conPassword}
                                                required
                                          />
                                          <button type='submit'
                                                className='w-full mt-2 bg-[black] hover:bg-[#4b4b4b] text-white 
                                    py-2 px-4 rounded-md font-medium cursor-pointer'
                                                onClick={resetPassword} disabled={loading}>
                                                {
                                                      loading ? <ClipLoader color='white' size={30} />
                                                            : "Reset Password "
                                                }
                                          </button>

                                          <div className="text-sm text-center mt-4"
                                                onClick={() => navigate("/login")} >
                                                Back to Login
                                          </div>
                                    </form>

                              </div>
                        }

                  </div>

            </>
      )
}
