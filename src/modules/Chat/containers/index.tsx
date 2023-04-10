import { FC, ReactElement, useLayoutEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

// components
import BaseChat from "../components/Chat";

// hooks
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";

// selectors
import { messageSelector } from "../../../store/slices/message/messageSlice";
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

const Chat: FC = (): ReactElement => {
	const { status } = useSelector(messageSelector);
	const { currentDialogue } = useSelector(dialogueSelector);
	const { user } = useAuth();

	const [messageValue, setMessageValue] = useState<string>("");
	const [chatInputHeight, setChatInputHeight] = useState(76);

	const chatInputRef = useRef<HTMLDivElement>(null);
	const heightValue = useDebounce(messageValue, 500);

	useLayoutEffect(() => {
		if (chatInputRef.current) {
			setChatInputHeight(chatInputRef.current.offsetHeight);
		}
	}, [heightValue]);

	const interlocutor = currentDialogue?.members.find((member) => member._id !== user?._id);

	return (
		<BaseChat
			interlocutor={interlocutor ? interlocutor : null}
			status={status}
			chatInputRef={chatInputRef}
			messageValue={messageValue}
			setMessageValue={setMessageValue}
			chatInputHeight={chatInputHeight}
		/>
	);
};

export default Chat;
