import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { Flip, ToastContainer, Zoom } from 'react-toastify';;
import { useSelector } from 'react-redux';
import ForgetPassword from './pages/ForgetPassword';
import useCurrentUser from './customHooks/getCurrentUser';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/Educator/Dashboard';
import Courses from './pages/Educator/Courses';
import CreateCourse from './pages/Educator/CreateCourse';
import useCreatorCourses from './customHooks/getcreateCourse';
import EditCourse from './pages/Educator/EditCourse';
import { usePublishCourse } from './customHooks/getPublishCourse';
import AllCourses from './pages/AllCourses';
import CreateLecture from './pages/Educator/CreateLecture';
import EditLecture from './pages/Educator/EditLecture';
import ViewCourses from './pages/ViewCourses';
import ScrollToTop from './components/ScrollToTop';
import ViewLecture from './pages/ViewLecture';
import MyEnrolledCourses from './pages/MyEnrolledCourses';
import { useGetAllreviews } from './customHooks/getAllreviews';
import SearchWithAi from './pages/SearchWithAi';
import useAllCourses from './customHooks/getAllCourses';
import NoPage from './components/NoPage';

export const serverUrl = 'http://localhost:8000'

function App() {

  let { userData, loadingUser } = useSelector(state => state.user)

  useCurrentUser()
  useGetAllreviews();
  useAllCourses()
  usePublishCourse();
  useCreatorCourses(userData?.role === 'educator');
  

  if (loadingUser) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />

      
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={'/'} />} />
        <Route path="/login"
          element={<Login />} />
        <Route path="/forgetpassword"
          element={<ForgetPassword />} />
        <Route path="/profile"
          element={userData ? <Profile /> : <Navigate to={'/signup'} />} />
        <Route path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to={'/signup'} />} />
        <Route path={'/dashboard'}
          element={userData?.role === 'educator' ? <Dashboard /> : <Navigate to={'/signup'} />} />
        <Route path={'/courses'}
          element={userData?.role === 'educator' ? <Courses /> : <Navigate to={'/signup'} />} />
        <Route path={'/createcourses'}
          element={userData?.role === 'educator' ? <CreateCourse /> : <Navigate to={'/signup'} />} />
        <Route path={'/addcourses/:courseId'}
          element={userData?.role === 'educator' ? <EditCourse /> : <Navigate to={'/signup'} />} />
        <Route path='/allcourses'
          element={userData ? <AllCourses /> : <Navigate to={'/signup'} />} />
        <Route path='/createlecture/:courseId'
          element={userData?.role === 'educator' ? <CreateLecture /> : <Navigate to={'/signup'} />} />
        <Route path='/editlecture/:courseId/:lectureId'
          element={userData?.role === 'educator' ? <EditLecture /> : <Navigate to={'/signup'} />} />
        <Route path='/viewcourse/:courseId'
          element={userData ? <ViewCourses /> : <Navigate to={'/signup'} />} />
        <Route path='/viewlecture/:courseId'
          element={userData ? <ViewLecture /> : <Navigate to={'/signup'} />} />
        <Route path='/mycourses'
          element={userData ? <MyEnrolledCourses /> : <Navigate to={'/signup'} />} />
        <Route path='/searchwithai'
          element={userData ? <SearchWithAi /> : <Navigate to={'/signup'} />} />
        <Route path='*' element={<NoPage/>} />
      </Routes>

    </>

  )
}

export default App
