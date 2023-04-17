import { FC, ReactElement, useState, MouseEvent, Dispatch, SetStateAction } from "react";

// components
import BaseMessage from "../components/Message";

// types
import IMessage from "../../../models/IMessage";
import { IMessageValue } from ".";

type MessageProps = IMessage & {
	isRead?: boolean;
	attachments?: any[];
	audio?: string;
	setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
	handleRemoveMessage: (id: string) => void;
};

const Message: FC<MessageProps> = (props): ReactElement => {
	const { setMessageValue, handleRemoveMessage } = props;

	const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

	const open = Boolean(anchorEl);

	const handleOpen = (event: MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	return (
		<BaseMessage
			{...props}
			anchorEl={anchorEl}
			open={open}
			handleOpen={handleOpen}
			handleClose={handleClose}
			setMessageValue={setMessageValue}
			handleRemoveMessage={handleRemoveMessage}
		/>
	);
};

export default Message;
