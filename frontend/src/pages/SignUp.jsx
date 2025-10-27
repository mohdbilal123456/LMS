import React, { useState } from 'react'
import logo from '../assets/images/bilal-logo.png'
import google from '../assets/images/google.jpg'
import axios from 'axios'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App';
import { toast, Zoom } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';

function SignUp() {

    const [show, setShow] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('student')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Signup with email/password
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`,
                { name, email, password, role }, { withCredentials: true })
            dispatch(setUserData(result.data.user))
            toast.success(`🎉 Successfully signed up as ${role.charAt(0).toUpperCase() + role.slice(1)}!`, {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Zoom,
            });
            navigate('/')
        }
        catch (error) {
            toast.error(` ${error.response?.data?.message || "Signup Failed!"}`, {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Zoom,
            });
            setLoading(false)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Google Signup (only for students)
    const googleSignup = async () => {
        if (role === 'educator') {
            toast.error(' Educators cannot signup via Google. Use email/password.', {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Zoom,
            });
            return
        }
        setLoading(true)
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user
            const Gname = user.displayName
            const Gemail = user.email

            const result = await axios.post(`${serverUrl}/api/auth/googleauth`,
                { name: Gname, email: Gemail, role }, { withCredentials: true }
            )
            dispatch(setUserData(result.data.user))
            toast.success('🎉 Successfully signed up as Student!', {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Zoom,
            });
            navigate('/')
        } catch (error) {
            toast.error(` ${error.response?.data?.message || "Google Signup Failed!"}`, {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Zoom,
            });
            
            console.log(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className='bg-[#ccc] w-full h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form autoComplete='off' className='w-[90%] md:w-185 h-150 bg-[white] shadow-lime-300 rounded-2xl flex'
                onSubmit={handleSubmit}>

                {/* Left Form */}
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3'>
                    <div>
                        <h1 className='font-semibold text-[black] text-2xl'>Let's get Started</h1>
                        <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
                    </div>

                    {/* Name */}
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="name" className='font-semibold'>Name</label>
                        <input id='name' type="text"
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    {/* Email */}
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input id='email' type="text"
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {/* Password */}
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        <input autoComplete='new-password' id='password' type={show ? "text" : "password"}
                            className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
                            placeholder='***********' value={password} onChange={(e) => setPassword(e.target.value)} />
                        {!show && <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(true)} />}
                        {show && <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(false)} />}
                    </div>

                    {/* Role Select */}
                    <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
                        <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer ${role === 'student' ? 'border-black' : 'border-[#646464]'}`}
                            onClick={() => setRole('student')}>Student</span>
                        <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer ${role === 'educator' ? 'border-black' : 'border-[#646464]'}`}
                            onClick={() => setRole('educator')}>Educator</span>
                    </div>

                    {/* Submit Button */}
                    <button className='w-[80%] h-[40px] bg-blue-900 text-white flex items-center justify-center rounded-[5px] hover:opacity-80' disabled={loading}>
                        {loading ? <ClipLoader size={30} color='white' /> : 'SignUp'}
                    </button>

                    {/* Or Continue with Google */}
                    <div className='w-[80%] flex items-center gap-2'>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                        <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>Or continue with</div>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                    </div>

                    {role === 'student' &&
                        <div className='w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center cursor-pointer mt-2'
                            onClick={googleSignup}>
                            <img src={google} alt="" className='w-[25px]' />
                            <span className='text-[18px] text-gray-500 ml-2'>Google</span>
                        </div>
                    }

                    <div className='text-[#6f6f6f] mt-2'>Already have an account?
                        <span className='underline underline-offset-2 cursor-pointer text-[black]' onClick={() => navigate('/login')}> Login</span>
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

export default SignUp
