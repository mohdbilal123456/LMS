import React from 'react'
import { useNavigate } from 'react-router-dom'

function NoPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </button>
    </div>
  )
}

export default NoPage
