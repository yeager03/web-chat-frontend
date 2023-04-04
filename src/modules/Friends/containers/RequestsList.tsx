import { FC, ReactElement, MouseEvent } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// selector
import { friendSelector } from "../../../store/slices/friend/friendSlice";

// actions
import { acceptFriend, denyFriend } from "../../../store/slices/friend/friendActions";

// components
import BaseRequestsList from "../components/RequestsList";

const RequestsList: FC = (): ReactElement => {
	const { requests, status } = useSelector(friendSelector);
	const dispatch = useAppDispatch();

	const acceptRequestFriend = (e: MouseEvent<HTMLButtonElement>, id: string) => {
		dispatch(acceptFriend(id));
	};

	const denyRequestFriend = (e: MouseEvent<HTMLButtonElement>, id: string) => {
		dispatch(denyFriend(id));
	};

	return (
		<BaseRequestsList
			requests={requests}
			status={status}
			acceptRequestFriend={acceptRequestFriend}
			denyRequestFriend={denyRequestFriend}
		/>
	);
};

export default RequestsList;
