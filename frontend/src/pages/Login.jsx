import React, { useState } from 'react'
import logo from '../assets/images/bilal-logo.png'
import google from '../assets/images/google.jpg'
import axios from 'axios';
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { toast, Zoom } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';


export default function Login() {

  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loginLoading, setLoginLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/login`,
        { email, password, role }, { withCredentials: true })
      dispatch(setUserData(result.data.user))
      toast.success(`🎉 Successfully logged in as ${role.charAt(0).toUpperCase() + role.slice(1)}!`, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
        transition: Zoom,
      });
      navigate('/')
    } 
    catch (error) {
      toast.error(` ${error.response?.data?.message || "Email or password is incorrect!"}`, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
        transition: Zoom,
      });
      console.log(error)
    } 
    finally {
      setLoginLoading(false)
    }
  }

  // Google Login (Student only)
  const googleLogin = async () => {
    if (role === 'educator') {
      toast.error('❌ Educators cannot login via Google. Use email/password instead.', {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
        transition: Zoom,
      });
      return
    }

    setGoogleLoading(true)
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user
      const result = await axios.post(`${serverUrl}/api/auth/googleauth`,
        { name: user.displayName, email: user.email, role },
        { withCredentials: true }
      )
      // console.log('google data',result?.data)
      // console.log('google data',result?.data?.user?.name.charAt(0))
      dispatch(setUserData(result.data.user))
      toast.success(`🎉 Successfully logged in as Student!`, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
        transition: Zoom,
      });
      navigate('/')
    } catch (error) {
      toast.error(` ${error.response?.data?.message || "Google Login Failed!"}`, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
        transition: Zoom,
      });
      console.log(error)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className='bg-[#ccc] w-full h-[100vh] flex items-center justify-center flex-col gap-3'>
      <form
        autoComplete='off'
        className='w-[90%] md:w-185 h-150 bg-[white] shadow-lime-300 rounded-2xl flex'
        onSubmit={handleLogin}
      >
        {/* Left form */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3'>
          <div>
            <h1 className='font-semibold text-[black] text-2xl'>Let's get Started</h1>
            <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
          </div>

          {/* Email */}
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input
              id='email'
              autoComplete="new-email"
              type="text"
              className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-800'
              placeholder='Your email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
            <label htmlFor="password" className='font-semibold'>Password</label>
            <input
              id='password'
              autoComplete="new-password"
              type={show ? "text" : "password"}
              className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-800'
              placeholder='***********'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!show
              ? <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(true)} />
              : <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(false)} />
            }
          </div>

          {/* Role select */}
          <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
            <span
              className={`px-[10px] py-[5px] border-[1px] rounded-2xl cursor-pointer transition-all duration-200 ${role === 'student' ? 'border-black bg-blue-100' : 'border-gray-400'}`}
              onClick={() => setRole('student')}
            >
              Student
            </span>
            <span
              className={`px-[10px] py-[5px] border-[1px] rounded-2xl cursor-pointer transition-all duration-200 ${role === 'educator' ? 'border-black bg-blue-100' : 'border-gray-400'}`}
              onClick={() => setRole('educator')}
            >
              Educator
            </span>
          </div>

          {/* Submit */}
          <button
            disabled={loginLoading}
            className={`w-[80%] h-[40px] bg-blue-900 text-white flex items-center justify-center rounded-[5px] transition-all duration-200 
              ${loginLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80'}`}
          >
            {loginLoading ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>

          <span
            className='text-[13px] cursor-pointer text-[#585757] hover:underline'
            onClick={() => navigate("/forgetpassword")}
          >
            Forget your password?
          </span>

          {/* Google login */}
          {
            role === 'student' && (
              <div
                className={`w-[80%] h-[40px] border border-[black] rounded-[5px] flex items-center justify-center cursor-pointer mt-2 transition-all duration-200 
                ${googleLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                onClick={!googleLoading ? googleLogin : undefined}
              >
                {googleLoading
                  ? <ClipLoader size={20} color="black" />
                  : (
                    <>
                      <img src={google} alt="" className='w-[25px]' />
                      <span className='text-[18px] text-gray-600 ml-2'>Google</span>
                    </>
                  )
                }
              </div>
            )}

          <div className='text-[#6f6f6f] mt-2'>
            Don't have an account?
            <span
              className='underline underline-offset-2 cursor-pointer text-[black] ml-1 hover:text-blue-800'
              onClick={() => navigate('/signup')}
            >
              Signup
            </span>
          </div>
        </div>

        {/* Right image */}
        <div className='w-[50%] h-[100%] rounded-r-2xl bg-blue-900 md:flex items-center justify-center flex-col gap-3 hidden'>
          <img src={logo} className='w-30 shadow-2xl rounded-full' alt="" />
          <span className='text-[white] text-2xl font-semibold'>CodeVista Courses</span>
        </div>
      </form>
    </div>
  )
}
