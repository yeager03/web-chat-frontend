import { FC, ReactElement, useEffect, useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// dispatch
import { useAppDispatch } from "../../../store";

// selector
import { friendSelector } from "../../../store/slices/friend/friendSlice";

// actions
import { getFriends, removeFriend } from "../../../store/slices/friend/friendActions";
import { setCurrentDialogue, setCurrentDialogueId } from "../../../store/slices/dialogue/dialogueSlice";
import { socketClearMessages } from "../../../store/slices/message/messageSlice";

// service
import DialogueService from "../../../services/DialogueService";

// components
import BaseFriendsList from "../components/FriendsList";
import MessageModal from "../components/MessageModal";

// utils
import getNotification from "../../../utils/notification";

// types
import DialogueResponse from "../../../models/response/DialogueResponse";

const FriendsList: FC = (): ReactElement => {
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	const [messageValue, setMessageValue] = useState<string>("");
	const [interlocutorId, setInterlocutorId] = useState<string | null>(null);

	const { friends, status } = useSelector(friendSelector);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(socketClearMessages());
		dispatch(setCurrentDialogue(null));
		dispatch(setCurrentDialogueId(""));
		dispatch(getFriends());
	}, []);

	const showModal = (e: MouseEvent<HTMLSpanElement>, id: string) => {
		setModalOpen(true);
		setInterlocutorId(id);

		console.log(id);
	};

	const handleOk = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (interlocutorId) {
			try {
				const response = await DialogueService.createDialogue({
					interlocutorId,
					lastMessageText: messageValue.trim(),
				});
				const { status, message, dialogue }: DialogueResponse = response.data;

				if (status === "success") {
					getNotification(message, status);

					dispatch(setCurrentDialogueId(dialogue._id));
					dispatch(setCurrentDialogue(dialogue));

					navigate(`/dialogues/${dialogue._id}`, {
						replace: true,
					});
				}
			} catch (error: any) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification(message, status);
				}
			}
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMessageValue(e.target.value);
	};

	const handleCancel = () => {
		setModalOpen(false);
	};

	const handleDeleteFriend = (e: MouseEvent<HTMLParagraphElement>, id: string) => {
		dispatch(removeFriend(id));
	};

	return (
		<>
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
		</>
	);
};

export default FriendsList;
