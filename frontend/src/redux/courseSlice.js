import { createSlice } from '@reduxjs/toolkit'

const courseSlice = createSlice({
      name : 'course',
      initialState : {
            creatorCourseData : [],
            courseData:[],
            selectedCourse:null

      },
      reducers : {
            setCreatorCourseData : (state,action)=>{
                 state.creatorCourseData = action.payload 
            },
            setCourseData : (state,action)=>{
                  state.courseData = action.payload
            },
            setSelectedCourse : (state,action)=>{
                  state.selectedCourse = action.payload
            }
      }
})

export const { setCreatorCourseData, setCourseData, setSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
