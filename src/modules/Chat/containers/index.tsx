import { FC, ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// components
import BaseChat from "../components/Chat";

// hook
import useAuth from "../../../hooks/useAuth";

// selectors
import { messageSelector } from "../../../store/slices/message/messageSlice";
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

const Chat: FC = (): ReactElement => {
	const { status, messages } = useSelector(messageSelector);
	const { currentDialogue } = useSelector(dialogueSelector);
	const { user } = useAuth();

	let interlocutor = null;

	if (currentDialogue?.author._id === user?._id) {
		interlocutor = currentDialogue?.interlocutor;
	} else {
		interlocutor = currentDialogue?.author;
	}

	const messagesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = messagesRef.current;

		if (element) {
			element.scrollTo(0, element.scrollHeight);
		}
	}, [messages]);

	return <BaseChat interlocutor={interlocutor ? interlocutor : null} status={status} messagesRef={messagesRef} />;
};

export default Chat;
