import { FC, ReactElement, RefObject, Dispatch, SetStateAction } from "react";

// containers
import Messages from "../../containers/Messages";
import ChatInput from "../../containers/ChatInput";

// classnames
import cn from "classnames";

// styles
import styles from "./Chat.module.scss";

// mui components
import { Box, Typography } from "@mui/material";

// types
import { Status } from "../../../../models/Status";

// models
import IUser from "../../../../models/IUser";
import { Emoji, IMessageValue } from "../../containers";

// emoji
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type ChatProps = {
	interlocutor: IUser | null;
	status: Status;
	showEmojis: boolean;
	inputRef: RefObject<HTMLDivElement>;
	chatInputRef: RefObject<HTMLDivElement>;
	triggerRef: RefObject<SVGSVGElement>;
	nodeRef: RefObject<HTMLDivElement>;
	chatInputHeight: number;
	messageValue: IMessageValue;
	setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
	toggleEmojiModal: (flag: boolean) => void;
	cursorInput: () => void;
	clearInput: () => void;
	handleClickEmoji: (emoji: Emoji) => void;
	handleSendMessage: () => void;
	handleEditMessage: (id: string, message: string) => void;
	handleRemoveMessage: (id: string) => void;
};

const Chat: FC<ChatProps> = (props): ReactElement => {
	const {
		interlocutor,
		status,
		showEmojis,
		inputRef,
		chatInputRef,
		chatInputHeight,
		triggerRef,
		nodeRef,
		messageValue,
		toggleEmojiModal,
		setMessageValue,
		clearInput,
		cursorInput,
		handleClickEmoji,
		handleSendMessage,
		handleEditMessage,
		handleRemoveMessage,
	} = props;

	return (
		<Box className={styles["chat"]}>
			{interlocutor && (
				<Box className={styles["chat__header"]}>
					<Typography className={styles["chat__header-title"]} variant="h3">
						{interlocutor.fullName}
					</Typography>
					<Box
						className={cn(styles["chat__header-status"], {
							[styles["chat__header-status_online"]]: interlocutor.isOnline,
						})}
					>
						<span className={styles["status"]}>{interlocutor.isOnline ? "онлайн" : "офлайн"}</span>
					</Box>
				</Box>
			)}
			<Messages
				status={status}
				chatInputHeight={chatInputHeight}
				setMessageValue={setMessageValue}
				handleRemoveMessage={handleRemoveMessage}
			/>

			{status === "success" && (
				<>
					<ChatInput
						inputRef={inputRef}
						chatInputRef={chatInputRef}
						nodeRef={nodeRef}
						triggerRef={triggerRef}
						showEmojis={showEmojis}
						messageValue={messageValue}
						toggleEmojiModal={toggleEmojiModal}
						setMessageValue={setMessageValue}
						cursorInput={cursorInput}
						clearInput={clearInput}
						handleSendMessage={handleSendMessage}
						handleEditMessage={handleEditMessage}
						handleRemoveMessage={handleRemoveMessage}
					/>

					{showEmojis && (
						<Box ref={nodeRef} className={styles["emoji"]} sx={{ bottom: `${chatInputHeight}px` }}>
							<Picker data={data} onEmojiSelect={handleClickEmoji} theme="light" locale="ru" />
						</Box>
					)}
				</>
			)}
		</Box>
	);
};

export default Chat;
