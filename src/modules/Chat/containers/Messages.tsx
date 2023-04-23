import { FC, ReactElement, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// socket
import { socket } from "../../../core/socket";

// components
import BaseMessages from "../components/Messages";

// selectors
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";
import { messageSelector } from "../../../store/slices/message/messageSlice";

// actins
import { getMessages } from "../../../store/slices/message/messageActions";
import { setTyping } from "../../../store/slices/message/messageSlice";

// types
import { Status } from "../../../models/Status";
import { IMessageValue } from ".";
import IUser from "../../../models/IUser";
import { IFile } from "../../../models/IMessage";

type MessagesProps = {
	status: Status;
	chatInputHeight: number;
	interlocutor: IUser | null;
	setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
	setImages: Dispatch<SetStateAction<IFile[]>>;
	handleRemoveMessage: (id: string) => void;
	handleEditFiles: (files: IFile[]) => void;
};

type TypingResponse = {
	flag: boolean;
	interlocutorId: string;
	currentDialogueId: string;
};

const Messages: FC<MessagesProps> = (props): ReactElement => {
	const { status, chatInputHeight, interlocutor, setMessageValue, setImages, handleRemoveMessage, handleEditFiles } =
		props;

	const { currentDialogueId } = useSelector(dialogueSelector);
	const { messages, isTyping } = useSelector(messageSelector);

	const messagesRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (currentDialogueId) {
			dispatch(getMessages(currentDialogueId));

			let timer: NodeJS.Timeout;

			socket.on("SERVER:TYPING_RESPONSE", (data: TypingResponse) => {
				if (currentDialogueId === data.currentDialogueId) {
					dispatch(setTyping(data.flag));

					timer = setTimeout(() => {
						dispatch(setTyping(false));
					}, 3000);
				}

				console.log(data);
			});

			return () => {
				clearTimeout(timer);
			};
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
			isTyping={isTyping}
			interlocutor={interlocutor}
			setMessageValue={setMessageValue}
			setImages={setImages}
			handleRemoveMessage={handleRemoveMessage}
			handleEditFiles={handleEditFiles}
		/>
	);
};

export default Messages;
