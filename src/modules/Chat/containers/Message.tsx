import { FC, ReactElement, useState, MouseEvent } from "react";

// dispatch
import { useAppDispatch } from "../../../store";

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
	const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

	const open = Boolean(anchorEl);
	const dispatch = useAppDispatch();

	const handleOpen = (event: MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);
	const handleRemoveMessage = (messageId: string) => dispatch(removeMessage(messageId));

	return (
		<BaseMessage
			{...props}
			handleRemoveMessage={handleRemoveMessage}
			isTyping={isTyping}
			anchorEl={anchorEl}
			open={open}
			handleOpen={handleOpen}
			handleClose={handleClose}
		/>
	);
};

export default Message;
