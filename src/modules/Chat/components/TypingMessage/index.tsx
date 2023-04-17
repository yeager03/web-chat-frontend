import { FC, ReactElement } from "react";

// style
import styles from "./TypingMessage.module.scss";

// mui components
import { Box } from "@mui/material";

// components
import UserAvatar from "../../../../components/UserAvatar";

// classnames
import cn from "classnames";

// types
import IUser from "../../../../models/IUser";

type TypingMessageProps = {
	isTyping: boolean;
	interlocutor: IUser | null;
};

const TypingMessage: FC<TypingMessageProps> = (props): ReactElement => {
	const { isTyping, interlocutor } = props;

	return (
		<Box
			className={cn(styles["message"], {
				[styles["message_typing"]]: isTyping,
			})}
		>
			{interlocutor && (
				<Box className={styles["message__avatar"]}>
					<UserAvatar user={interlocutor} />
				</Box>
			)}

			<Box className={styles["message__content"]}>
				<Box className={styles["message__bubble"]}>
					{isTyping && (
						<Box className={styles["message__typing"]}>
							<span></span>
							<span></span>
							<span></span>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default TypingMessage;
