import { FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";

// components
import IconRead from "../../../../components/IconRead";
import Avatar from "../../../../components/Avatar";

// classnames
import cn from "classnames";

// style
import styles from "./Dialogue.module.scss";

// date
import getDialogueDate from "../../../../utils/dialogueDate";

// hooks
import useAuth from "../../../../hooks/useAuth";

// types
import IDialogue from "../../../../models/IDialogue";

type DialogueProps = IDialogue & {
	currentDialogueId: string | null;
};

const Dialogue: FC<DialogueProps> = (props): ReactElement => {
	const { _id, lastMessage, interlocutor, updatedAt, currentDialogueId } = props;
	const { user } = useAuth();
	const navigate = useNavigate();

	const isRead = false; // test
	const isMyMessage = user?._id === lastMessage.author._id;

	return (
		<li
			className={cn(styles["dialogue__item"], {
				[styles["dialogue__item_online"]]: interlocutor.isOnline,
				[styles["dialogue__item_current"]]: _id === currentDialogueId,
			})}
			onClick={() =>
				navigate(`/dialogue/${_id}`, {
					replace: true,
				})
			}
		>
			<div className={styles["dialogue__item-avatar"]}>
				<Avatar user={lastMessage.author} />
			</div>
			<div className={styles["dialogue__item-info"]}>
				<div className={styles["dialogue__item-title"]}>
					<b className={styles["title"]}>{interlocutor["fullName"]}</b>
					<span className={styles["date"]}>{getDialogueDate(updatedAt)}</span>
				</div>
				<div className={styles["dialogue__item-subtitle"]}>
					<p className={styles["text"]}>{lastMessage["message"]}</p>

					{/* {lastMessage["unRead"] && lastMessage["unRead"] > 0 ? (
						<span className={styles["count"]}>{lastMessage["unRead"] > 10 ? "10+" : lastMessage["unRead"]}</span>
					) : (
						<IconRead className={styles["icon"]} isMyMessage={isMyMessage} isRead={isRead} />
					)} */}

					<IconRead className={styles["icon"]} isMyMessage={isMyMessage} isRead={isRead} />
				</div>
			</div>
		</li>
	);
};

export default Dialogue;
