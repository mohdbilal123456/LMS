import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ai from "../assets/images/SearchAi.png";
import { useSelector } from "react-redux";
import Card from "../components/Card";

function AllCourses() {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // loading state
  const { courseData } = useSelector((state) => state.course);

  // Handle checkbox selection
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  //  Apply category filter
  const applyFilter = () => {
    if (!Array.isArray(courseData)) return;
    let courseCopy = [...courseData];
    if (category.length > 0) {
      courseCopy = courseCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    setFilterCourses(courseCopy);
  };

  //  Update filtered data when courseData changes
  useEffect(() => {
    if (Array.isArray(courseData)) {
      setFilterCourses(courseData);
    } else {
      setFilterCourses([]);
    }
    setIsLoading(false); // data loaded
  }, [courseData]);

  //  Apply filter when category changes
  useEffect(() => {
    applyFilter();
  }, [category]);

  //  Loading state
  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="w-full h-screen flex flex-col items-center justify-center text-gray-500">
          <p className="text-lg font-medium">Loading courses...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />

      {/*  Filter Button (Visible only on small screens) */}
      <div className="fixed top-[90px] left-4 z-20 md:hidden">
        <button
          className="px-4 py-1 bg-black text-white rounded-xl flex items-center gap-2 shadow-lg"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <FaFilter />
          Filter
        </button>
      </div>

      {/*  Sidebar */}
      <aside
        className={`w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px]
        border-r border-gray-200 shadow-md transition-transform duration-300 z-30
        ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"}  
        md:block md:translate-x-0`}
      >
        <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6">
          <FaArrowLeftLong
            className="text-white cursor-pointer"
            onClick={() =>
              window.innerWidth < 768
                ? setIsSidebarVisible(false)
                : navigate("/")
            }
          />

          Filter by Category
        </h2>

        <form
          className="space-y-4 text-sm bg-gray-600 border-white text-white border p-[20px] rounded-2xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <button
            className="px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => navigate("/searchwithai")}
          >
            Search with AI
            <img
              src={ai}
              className="w-[30px] h-[30px] rounded-full"
              alt="AI"
            />
          </button>

          {[
            "App Development",
            "AI/ML",
            "AI Tools",
            "Data Science",
            "Data Structure and Algorithm",
            "Cyber Security",
            "UI UX Designing",
            "Web Development",
            "Others",
          ].map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition"
            >
              <input
                type="checkbox"
                className="accent-black w-4 h-4 rounded-md"
                value={cat}
                onChange={toggleCategory}
              />
              {cat}
            </label>
          ))}
        </form>
      </aside>

      {/*  Main Course Section */}
      <main
        className="w-full transition-all duration-300 py-[130px]
        md:pl-[300px] flex items-start justify-center md:justify-start 
        flex-wrap gap-6 px-[10px]"
        onClick={() => {
          if (window.innerWidth < 768 && isSidebarVisible) {
            setIsSidebarVisible(false);
          }
        }}
      >
        {filterCourses.length > 0 ? (
          filterCourses.map((item, index) => (
            <Card
              key={index}
              thumbnail={item.thumbNail}
              title={item.title}
              price={item.price}
              category={item.category}
              id={item._id}
              reviews={item.reviews}
            />
          ))
        ) : (
          <div className="w-full h-[60vh] flex items-center justify-center text-gray-500 text-lg font-medium">
            No courses found for selected category.
          </div>
        )}
      </main>
    </>
  );
}

export default AllCourses;
