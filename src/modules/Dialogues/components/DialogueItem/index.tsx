import { FC, Fragment, ReactElement } from "react";
import { useNavigate } from "react-router-dom";

// components
import IconRead from "../../../../components/IconRead";
import UserAvatar from "../../../../components/UserAvatar";

// mui components
import { Typography, Box } from "@mui/material";

// classnames
import cn from "classnames";

// style
import styles from "./DialogueItem.module.scss";

// date
import getDialogueDate from "../../../../utils/dialogueDate";

// hooks
import useAuth from "../../../../hooks/useAuth";

// types
import { IDialogueItem } from "../DialoguesList";

type DialogueItemProps = IDialogueItem & {
	currentDialogueId: string | null;
};

const DialogueItem: FC<DialogueItemProps> = (props): ReactElement => {
	const { _id, interlocutor, lastMessage, updatedAt, currentDialogueId } = props;

	const { user } = useAuth();
	const navigate = useNavigate();

	const isRead = false; // test

	const isMyMessage = user?._id === lastMessage.author._id;

	return (
		<Fragment>
			{interlocutor && (
				<li
					className={cn(styles["dialogue__item"], {
						[styles["dialogue__item_online"]]: interlocutor.isOnline,
						[styles["dialogue__item_current"]]: _id === currentDialogueId,
					})}
					onClick={() =>
						navigate(`/dialogues/${_id}`, {
							replace: true,
						})
					}
				>
					<Box className={styles["dialogue__item-avatar"]}>
						<UserAvatar user={interlocutor} />
					</Box>
					<Box className={styles["dialogue__item-info"]}>
						<Box className={styles["dialogue__item-title"]}>
							<Typography variant="h3" className={styles["title"]}>
								{interlocutor.fullName}
							</Typography>
							<Typography component={"span"} className={styles["date"]}>
								{getDialogueDate(updatedAt)}
							</Typography>
						</Box>
						<Box className={styles["dialogue__item-subtitle"]}>
							<Typography className={styles["text"]}>{lastMessage["message"]}</Typography>

							{/* {lastMessage["unRead"] && lastMessage["unRead"] > 0 ? (
								<Typography component={"span"} className={styles["count"]}>
									{lastMessage["unRead"] > 10 ? "10+" : lastMessage["unRead"]}
								</Typography>
							) : (
								<IconRead className={styles["icon"]} isMyMessage={isMyMessage} isRead={isRead} />
							)} */}

							<IconRead className={styles["icon"]} isMyMessage={isMyMessage} isRead={isRead} />
						</Box>
					</Box>
				</li>
			)}
		</Fragment>
	);
};

export default DialogueItem;
