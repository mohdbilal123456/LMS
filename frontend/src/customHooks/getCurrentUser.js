import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setLoadingUser, setUserData } from '../redux/userSlice'
import { serverUrl } from '../App'

const useCurrentUser = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchUser = async () => {

            dispatch(setLoadingUser(true))
            try {
                const result = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
                    withCredentials: true,
                })
                console.log('Current User:', result.data)
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log('Error fetching current user:', error)
                dispatch(setUserData(null))
            }
            finally{
                dispatch(setLoadingUser(false))
            }
        }

        fetchUser()
    }, [dispatch])
}

export default useCurrentUser
