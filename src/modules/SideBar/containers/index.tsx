import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

// components
import BaseSideBar from "../components";

// dispatch
import { useAppDispatch } from "../../../store";

// actions
import { logOut } from "../../../store/slices/user/authActions";

// hooks
import useAuth from "../../../hooks/useAuth";

// selector
import { friendSelector } from "../../../store/slices/friend/friendSlice";

const SideBar: FC = (): ReactElement => {
	const { user } = useAuth();
	const { requestsLength } = useSelector(friendSelector);

	const dispatch = useAppDispatch();

	const logout = () => {
		dispatch(logOut());
	};

	return <BaseSideBar user={user} logout={logout} requestsLength={requestsLength} />;
};

export default SideBar;
