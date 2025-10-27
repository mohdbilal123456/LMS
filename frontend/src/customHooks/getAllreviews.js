import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setReviewData } from '../redux/reviewSlice'
// import { useParams } from 'react-router'

export const  useGetAllreviews = ()=> {
  
      const dispatch = useDispatch()
      const { userData } = useSelector(state => state.user)

      
      useEffect(()=>{
          

            const allReview = async()=>{
                  try {
                      const result = await axios.get(`${serverUrl}/api/review/getreviews`,
                        {withCredentials:true}

                      ) 
                      dispatch(setReviewData(result.data)) 
                  //     console.log(result.data)
                  } 
                  catch (error) {
                       console.log(error) 
                  }
            }
            allReview()
      },[dispatch,userData])
}


