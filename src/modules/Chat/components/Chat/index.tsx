import { FC, ReactElement, RefObject } from "react";

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

type ChatProps = {
	interlocutor: IUser | null;
	status: Status;
	chatInputRef: RefObject<HTMLDivElement>;
	messageValue: string;
	setMessageValue: (value: string) => void;
	chatInputHeight: number;
};

const Chat: FC<ChatProps> = (props): ReactElement => {
	const { interlocutor, status, chatInputRef, messageValue, setMessageValue, chatInputHeight } = props;

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
			<Messages status={status} chatInputHeight={chatInputHeight} />

			{status === "success" && (
				<ChatInput messageValue={messageValue} setMessageValue={setMessageValue} chatInputRef={chatInputRef} />
			)}
		</Box>
	);
};

export default Chat;
