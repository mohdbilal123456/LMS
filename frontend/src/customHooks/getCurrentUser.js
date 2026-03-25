import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoadingUser, setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

const useCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoadingUser(true));
      try {
        const res = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
          withCredentials: true,
        });
        console.log("Current User:", res.data);

        // ✅ Agar backend bole token not found, to null set karo
        if (!res.data || res.data.message === "token not found !!") {
          dispatch(setUserData(null));
        } else {
          dispatch(setUserData(res.data));
        }
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
        dispatch(setUserData(null));
      } finally {
        dispatch(setLoadingUser(false));
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useCurrentUser;

