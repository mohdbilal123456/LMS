import React, { useState } from 'react'
import logo from '../assets/images/bilal-logo.png'
import { IoMdPerson } from 'react-icons/io'
import { GiHamburgerMenu, GiSplitCross } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { serverUrl } from '../App'

function Nav() {
  const [showHam, setShowHam] = useState(false)
  const [showPro, setShowPro] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  console.log('navuserData', userData)

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      toast.success('Logged Out Successfully')
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
    }
  }

  // 🔹 Profile navigation
  const handleProfile = () => {
    if (!userData?._id) {
      navigate('/login')
    } else {
      navigate('/profile')
    }
  }

  // 🔹 Render profile avatar / initials / loading icon
  const renderProfileIcon = () => {
    if (!userData) {
      return (
        <div className='animate-pulse flex items-center justify-center'>
          <IoMdPerson className='w-[30px] h-[30px] fill-white' />
        </div>
      )
    }

    if (userData.photoUrl) {
      return (
        <img
          src={userData.photoUrl}
          alt='Profile'
          className='w-full h-full object-cover'
        />
      )
    }

    if (userData.name) {
      return (
        <span className='text-white font-bold'>
          {userData === undefined ? null : (
            userData ? (
              <span className='text-white font-bold'>
                {userData.name.trim().charAt(0).toUpperCase()}
              </span>
            ) : (
              <IoMdPerson className='w-[30px] h-[30px] fill-white' />
            )
          )}

        </span>
      )
    }

    return <IoMdPerson className='w-[30px] h-[30px] fill-white' />
  }

  return (
    <div className='overflow-x-hidden'>
      {/* Navbar */}
      <nav className='fixed top-0 left-0 w-full h-[70px] px-4 py-2 flex items-center justify-between bg-[#00000047] backdrop-blur-sm z-20'>
        {/* Logo */}
        <div className='flex items-center p-3 lg:pl-12 w-[40%] lg:w-[20%]'>
          <img
            src={logo}
            alt='logo'
            className='w-[45px] sm:w-[60px] border-2 border-white cursor-pointer rounded-full'
            onClick={() => navigate('/')}
          />
        </div>

        {/* Desktop Menu */}
        <div className='hidden lg:flex items-center justify-center gap-4 w-[40%]'>
          <div
            onClick={() => setShowPro((prev) => !prev)}
            className='w-[50px] h-[50px] rounded-full flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer overflow-hidden'
          >
            {renderProfileIcon()}
          </div>

          {userData?.role === 'educator' && (
            <button
              onClick={() => navigate('/dashboard')}
              className='px-5 py-2 border-2 border-white text-white rounded-[10px] bg-black text-[18px] hover:bg-gray-800 transition'
            >
              Dashboard
            </button>
          )}

          {!userData ? (
            <button
              onClick={() => navigate('/login')}
              className='px-5 py-2 border-2 border-white text-white rounded-[10px] bg-[#000000d5] text-[18px]'
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className='px-5 py-2 bg-white text-black rounded-[10px] text-[18px] shadow-sm shadow-black hover:bg-gray-100 transition'
            >
              Logout
            </button>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <GiHamburgerMenu
          className='w-[30px] h-[30px] lg:hidden fill-white cursor-pointer'
          onClick={() => setShowHam((prev) => !prev)}
        />
      </nav>

      {/* Profile dropdown (Desktop) */}
      {showPro && (
        <div className='fixed z-50 top-[80px] right-[14%] flex flex-col items-center gap-2 bg-white px-4 py-3 rounded-md border-2 border-black shadow-md'>
          <span
            className='bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-700 cursor-pointer'
            onClick={handleProfile}
          >
            My Profile
          </span>
          <span
            className='bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-700 cursor-pointer'
            onClick={() => navigate('/mycourses')}
          >
            My Courses
          </span>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#000000d6] flex flex-col items-center justify-center gap-6 z-10 transform transition-transform duration-500 ease-in-out ${showHam ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <GiSplitCross
          className='w-[35px] h-[35px] fill-white absolute top-5 right-5 cursor-pointer'
          onClick={() => setShowHam((prev) => !prev)}
        />
        <div className='w-[50px] h-[50px] border-2 border-white bg-black rounded-full flex items-center justify-center overflow-hidden'>
          {renderProfileIcon()}
        </div>

        <button
          onClick={handleProfile}
          className='w-[200px] text-white border-2 border-[#fdfbfb7a] bg-[#000000d5] rounded-lg py-3 text-[18px]'
        >
          My Profile
        </button>

        <button
          onClick={() => navigate('/mycourses')}
          className='w-[200px] text-white border-2 border-[#fdfbfb7a] bg-[#000000d5] rounded-lg py-3 text-[18px]'
        >
          My Courses
        </button>

        {userData?.role === 'educator' && (
          <button
            onClick={() => navigate('/dashboard')}
            className='w-[200px] text-white border-2 border-[#fdfbfb7a] bg-[#000000d5] rounded-lg py-3 text-[18px]'
          >
            Dashboard
          </button>
        )}

        {!userData ? (
          <button
            onClick={() => navigate('/login')}
            className='w-[200px] text-white border-2 border-[#fdfbfb7a] bg-[#000000d5] rounded-lg py-3 text-[18px]'
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className='w-[200px] text-white border-2 border-[#fdfbfb7a] bg-[#000000d5] rounded-lg py-3 text-[18px]'
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

export default Nav
