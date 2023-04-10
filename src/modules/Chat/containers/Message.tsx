import { FC, ReactElement, useState } from "react";

// dispatch
import { useAppDispatch } from "../../../store";

// socket
import socket from "../../../core/socket";

// actions
import { removeMessage } from "../../../store/slices/message/messageActions";

// components
import BaseMessage from "../components/Message";

// types
import IMessage from "../../../models/IMessage";

type MessageProps = IMessage & {
	isTyping?: boolean; // del ?
	isRead?: boolean;
	attachments?: any[];
	audio?: string;
};

const Message: FC<MessageProps> = (props): ReactElement => {
	const [isTyping, setTyping] = useState<boolean>(false);
	const dispatch = useAppDispatch();

	const handleRemoveMessage = (messageId: string) => {
		dispatch(removeMessage(messageId));
	};

	return <BaseMessage {...props} handleRemoveMessage={handleRemoveMessage} isTyping={isTyping} />;
};

export default Message;
