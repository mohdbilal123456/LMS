import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";


const ReviewCard = ({ text, name, image, rating, role }) => {
 


  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 max-w-sm w-full">
      
      {/* ⭐ Rating Stars */}
      <div className="flex items-center mb-3">
        {
        Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg mr-1">
              {i < rating ? <FaStar className="text-yellow-400 drop-shadow-md"/> : <FaRegStar className="text-gray-300"/>}
            </span>
          ))}
      </div>

      {/* 💬 Review Text */}
      <p className="text-gray-700 text-sm mb-5 line-clamp-4">{text}</p>
      
      {/* description */}

          <p className="text-xs text-gray-500">{role}</p>

      {/* 👤 Reviewer Info */}
      <div className="flex items-center gap-3 mt-4">
        {
          !image 
          ?
          <div className="w-10 h-10 bg-black text-white flex items-center
          justify-center rounded-full font-bold border-2 border-yellow-300 ">
            {name?.charAt(0).toUpperCase() || "U"}
          </div>
          :
          <img
          src={image || "https://via.placeholder.com/40"} // fallback image
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300"
        />
        }
       
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">{name}</h4>
          
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;


//  <img
//           src={image || "https://via.placeholder.com/40"} // fallback image
//           alt={name}
//           className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300"
//         />