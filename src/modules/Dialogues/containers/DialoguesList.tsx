import { FC, ReactElement, useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseDialoguesList from "../components/DialoguesList";

// selectors
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// hooks
import useAuth from "../../../hooks/useAuth";

// actions
import { setCurrentDialogueId, setCurrentDialogue } from "../../../store/slices/dialogue/dialogueSlice";
import { setTyping } from "../../../store/slices/message/messageSlice";
import { socket } from "../../../core/socket";

const DialoguesList: FC = (): ReactElement => {
	const [searchValue, setSearchValue] = useState<string>("");

	const { dialogues, status, currentDialogueId } = useSelector(dialogueSelector);
	const { dialogueId } = useParams();
	const { user } = useAuth();

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (dialogueId) {
			const currentDialogue = dialogues.find((dialogue) => dialogue._id === dialogueId);

			if (currentDialogue) {
				dispatch(setCurrentDialogueId(dialogueId));
				dispatch(setCurrentDialogue(currentDialogue));
				dispatch(setTyping(false));

				socket.emit("CLIENT:LEAVE_ROOM", currentDialogueId);
				socket.emit("CLIENT:JOIN_ROOM", dialogueId);
			}
		}
	}, [dialogueId]);

	const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const filteredDialogues = dialogues
		.map(({ _id, lastMessage, members, updatedAt, createdAt }) => ({
			_id,
			lastMessage,
			interlocutor: members.find((member) => member._id !== user?._id),
			updatedAt,
			createdAt,
		}))
		.filter(
			(dialogue) => String(dialogue.interlocutor?.fullName).toLowerCase().indexOf(searchValue.toLowerCase()) > -1
		);

	return (
		<BaseDialoguesList
			dialogues={filteredDialogues}
			searchValue={searchValue}
			handleChangeValue={handleChangeValue}
			status={status}
			// dialogue
			currentDialogueId={currentDialogueId}
		/>
	);
};

export default DialoguesList;
