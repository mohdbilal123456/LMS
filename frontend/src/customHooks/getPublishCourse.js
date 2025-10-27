import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setCourseData } from '../redux/courseSlice';

export function usePublishCourse() {

    const dispatch = useDispatch();
    // const {courseData} = useSelector(state=>state.course)
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
         if (!userData || userData.role !== 'educator') return;
        const getCourseData = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/course/getpublishcourses`, {
                    withCredentials: true
                });
                console.log('cc',result)
                dispatch(setCourseData(result.data));
            } catch (error) {
                console.log(error);
            }
        };
        getCourseData();
    }, [dispatch,userData]);
}
