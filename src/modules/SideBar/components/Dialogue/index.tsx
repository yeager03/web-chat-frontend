import { FC, ReactElement } from "react";

// components
import IconRead from "../../../../components/IconRead";
import Avatar from "../../../../components/Avatar";

// classnames
import cn from "classnames";

// style
import styles from "./Dialogue.module.scss";

// date
import getDialogueDate from "../../../../utils/helpers/getDialogueDate";

// types
import { Dialogue as DialogueItem } from "../../../../store/slices/dialoguesSlice";

type DialogueProps = DialogueItem & {
	currentDialogueID: string;
	handleClickDialogue: (id: string) => void;
	user: any; // del any
};

const Dialogue: FC<DialogueProps> = (props): ReactElement => {
	const { _id, lastMessage, user, created_at, currentDialogueID, handleClickDialogue } = props;

	const userID = "test123"; // test
	const isRead = false; // test

	const isMyMessage = user["_id"] === userID;

	return (
		<div
			className={cn(styles["dialogue__item"], {
				[styles["dialogue__item_online"]]: user["isOnline"],
				[styles["dialogue__item_current"]]: _id === currentDialogueID,
			})}
			onClick={() => handleClickDialogue(_id)}
		>
			<div className={styles["dialogue__item-avatar"]}>
				<Avatar user={user} />
			</div>
			<div className={styles["dialogue__item-info"]}>
				<div className={styles["dialogue__item-title"]}>
					<b className={styles["title"]}>{user["fullName"]}</b>
					<span className={styles["date"]}>{getDialogueDate(created_at)}</span>
				</div>
				<div className={styles["dialogue__item-subtitle"]}>
					<p className={styles["text"]}>{lastMessage}</p>

					{user["unRead"] && user["unRead"] > 0 ? (
						<span className={styles["count"]}>{user["unRead"] > 10 ? "10+" : user["unRead"]}</span>
					) : (
						<IconRead className={styles["icon"]} isMyMessage={isMyMessage} isRead={isRead} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Dialogue;
