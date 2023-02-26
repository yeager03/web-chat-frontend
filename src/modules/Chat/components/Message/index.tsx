import { FC, ReactElement } from "react";

// components
import Avatar from "../../../../components/Avatar";
import IconRead from "../../../../components/IconRead";
import AudioMessage from "../AudioMessage";

// classnames
import cn from "classnames";

// date
import getMessageDate from "../../../../utils/helpers/getMessageDate";

// style
import styles from "./Message.module.scss";

// types
import { Message as MessageItem } from "../../../../store/slices/messagesSlice";

type MessageProps = MessageItem & {
	isTyping?: boolean; // del ?
	isMyMessage?: boolean; // del ?
	isRead?: boolean;
	attachments?: any[];
	audio?: string;
};

const Message: FC<MessageProps> = (props): ReactElement => {
	const { user, text, created_at, isTyping, isMyMessage, isRead, attachments, audio } = props;

	return (
		<div
			className={cn(styles["message"], {
				[styles["message_my-message"]]: isMyMessage,
				[styles["message_typing"]]: isTyping,
				[styles["message_image"]]: attachments?.length === 1,
				[styles["message_audio"]]: audio,
			})}
		>
			<div className={styles["message__avatar"]}>
				<Avatar user={user} />
			</div>

			<div className={styles["message__content"]}>
				{(audio || isTyping || text) && (
					<div className={styles["message__bubble"]}>
						{isTyping && (
							<div className={styles["message__typing"]}>
								<span></span>
								<span></span>
								<span></span>
							</div>
						)}
						{text && <p className={styles["message__text"]}>{text}</p>}
						{audio && <AudioMessage audio={audio} />}
					</div>
				)}

				{attachments && (
					<div className={styles["message__attachments"]}>
						<ul className={styles["attachments-items"]}>
							{attachments.map((attachment) => {
								return (
									<li className={styles["attachment-item"]} key={attachment["url"]}>
										<img
											src={attachment["url"]}
											alt={attachment["filename"]}
											className={styles["attachment-item__image"]}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				)}

				{created_at && <span className={styles["message__date"]}>{getMessageDate(created_at)}</span>}

				<IconRead
					className={styles["message__checked-icon"]}
					isMyMessage={isMyMessage}
					isTyping={isTyping}
					isRead={isRead}
				/>
			</div>
		</div>
	);
};

export default Message;
