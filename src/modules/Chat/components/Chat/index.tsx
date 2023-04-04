import { FC, Fragment, ReactElement, RefObject } from "react";

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
	messagesRef: RefObject<HTMLDivElement>;
};

const Chat: FC<ChatProps> = (props): ReactElement => {
	const { interlocutor, status, messagesRef } = props;

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

			<Box className={styles["chat__messages"]} ref={messagesRef}>
				<Messages />
			</Box>

			{status !== "idle" && (
				<Box className={styles["chat__input"]}>
					<ChatInput />
				</Box>
			)}
		</Box>
	);
};

export default Chat;
