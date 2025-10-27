import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../redux/courseSlice";
import { serverUrl } from "../App";

export default function useAllCourses() {
      const dispatch = useDispatch();
      const { userData } = useSelector((state) => state.user);

      useEffect(() => {
            // Educator ke liye ye hook skip hoga
            if (userData?.role === "educator") return;

            const fetchPublicCourses = async () => {
                  try {
                        const result = await axios.get(`${serverUrl}/api/course/getpublishcourses`);
                        // console.log(" Public Courses:", result.data);
                        dispatch(setCourseData(result.data));
                  } catch (error) {
                        console.error(" Error fetching public courses:", error);
                  }
            };

            fetchPublicCourses();
      }, [userData, dispatch]);
}
