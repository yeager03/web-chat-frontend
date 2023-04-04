import { FC, ReactElement, useEffect, useState, ChangeEvent, FormEvent, Fragment, MouseEvent } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// selector
import { friendSelector } from "../../../store/slices/friend/friendSlice";

// actions
import { getFriends, removeFriend } from "../../../store/slices/friend/friendActions";

// components
import BaseFriendsList from "../components/FriendsList";
import MessageModal from "../components/MessageModal";

const FriendsList: FC = (): ReactElement => {
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	const [messageValue, setMessageValue] = useState<string>("");
	const [interlocutorId, setInterlocutorId] = useState<string | null>(null);

	const { friends, status } = useSelector(friendSelector);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getFriends());
	}, []);

	const showModal = (e: MouseEvent<HTMLSpanElement>, id: string) => {
		setModalOpen(true);
		setInterlocutorId(id);

		console.log(id);
	};

	const handleOk = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log(messageValue);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMessageValue(e.target.value.trim());
	};

	const handleCancel = () => {
		setModalOpen(false);
	};

	const handleDeleteFriend = (e: MouseEvent<HTMLParagraphElement>, id: string) => {
		dispatch(removeFriend(id));
	};

	return (
		<Fragment>
			<BaseFriendsList
				friends={friends}
				status={status}
				showModal={showModal}
				handleDeleteFriend={handleDeleteFriend}
			/>
			<MessageModal
				isModalOpen={isModalOpen}
				isSubmitting={false}
				messageValue={messageValue}
				handleChange={handleChange}
				handleOk={handleOk}
				handleCancel={handleCancel}
			/>
		</Fragment>
	);
};

export default FriendsList;
