import { useSelector } from "react-redux";

// selector
import { userSelector } from "../store/slices/user/userSlice";

const useAuth = () => useSelector(userSelector);

export default useAuth;
