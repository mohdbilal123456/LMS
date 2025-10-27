import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourseData } from '../redux/courseSlice'
import { serverUrl } from '../App'

export default function useCreatorCourses() {
      const dispatch = useDispatch()
      const { userData } = useSelector(state => state.user)

      useEffect(() => {
             if (!userData || userData.role !== 'educator') return;


            const fetchCreatorCourses = async () => {
                  try {
                        const result = await axios.get(`${serverUrl}/api/course/getcreator`, {
                              withCredentials: true,
                        })
                        console.log("Creator Courses:", result)
                        dispatch(setCreatorCourseData(result.data))
                  } catch (error) {
                        console.log(error)
                  }
            }

            fetchCreatorCourses()
      }, [userData, dispatch])
}
