import { FC, ReactElement, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseMessages from "../components/Messages";

// selectors
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";
import { messageSelector } from "../../../store/slices/message/messageSlice";

// actins
import { getMessages } from "../../../store/slices/message/messageActions";

// types
import { Status } from "../../../models/Status";
import { IMessageValue } from ".";

type MessagesProps = {
	status: Status;
	chatInputHeight: number;
	setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
	handleRemoveMessage: (id: string) => void;
};

const Messages: FC<MessagesProps> = (props): ReactElement => {
	const { status, chatInputHeight, setMessageValue, handleRemoveMessage } = props;

	const { currentDialogueId } = useSelector(dialogueSelector);
	const { messages } = useSelector(messageSelector);

	const messagesRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (currentDialogueId) {
			dispatch(getMessages(currentDialogueId));
		}
	}, [currentDialogueId]);

	useEffect(() => {
		const element = messagesRef.current;

		if (element) {
			element.scrollTo(0, element.scrollHeight);
		}
	}, [messages]);

	return (
		<BaseMessages
			messages={messages}
			status={status}
			messagesRef={messagesRef}
			chatInputHeight={chatInputHeight}
			setMessageValue={setMessageValue}
			handleRemoveMessage={handleRemoveMessage}
		/>
	);
};

export default Messages;
