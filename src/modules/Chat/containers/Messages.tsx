import { FC, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";

// socket
import socket from "../../../core/socket";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseMessages from "../components/Messages";

// selectors
import { dialogueSelector, setCurrentDialogue } from "../../../store/slices/dialogue/dialogueSlice";
import { addMessage, messageSelector } from "../../../store/slices/message/messageSlice";

// actins
import { getMessages } from "../../../store/slices/message/messageActions";

// models
import IMessage from "../../../models/IMessage";

const Messages: FC = (): ReactElement => {
	const { currentDialogueId, dialogues } = useSelector(dialogueSelector);
	const { messages, status } = useSelector(messageSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		function socketMessageListener(data: IMessage) {
			if (currentDialogueId === data.dialogue._id) {
				dispatch(addMessage(data));
			}
		}

		if (currentDialogueId) {
			const currentDialogue = dialogues.find((dialogue) => dialogue._id === currentDialogueId);

			if (currentDialogue) {
				dispatch(getMessages(currentDialogueId));
				dispatch(setCurrentDialogue(currentDialogue));
				socket.on("SERVER:MESSAGE_CREATED", socketMessageListener);
			}
		}

		return () => {
			socket.removeListener("SERVER:MESSAGE_CREATED", socketMessageListener);
		};
	}, [currentDialogueId]);

	return <BaseMessages messages={messages} status={status} />;
};

export default Messages;
