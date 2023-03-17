import { FC, ReactElement } from "react";

// antds components
import { Popover } from "antd";

// components
import Avatar from "../../../../components/Avatar";
import IconRead from "../../../../components/IconRead";
import AudioMessage from "../AudioMessage";

// icons
import { DeleteFilled, EditOutlined } from "@ant-design/icons";

// classnames
import cn from "classnames";

// date
import getMessageDate from "../../../../utils/messageDate";

// style
import styles from "./Message.module.scss";

// types
import IMessage from "../../../../models/IMessage";
import useAuth from "../../../../hooks/useAuth";

type MessageProps = IMessage & {
	isTyping: boolean; // del ?
	isRead?: boolean;
	attachments?: any[];
	audio?: string;
	handleRemoveMessage: (messageId: string) => void;
};

const Message: FC<MessageProps> = (props): ReactElement => {
	const { _id, author, message, createdAt, isTyping, isRead, attachments, audio, handleRemoveMessage } = props;
	const { user } = useAuth();

	const isMyMessage = user?._id === author._id;

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
				<Avatar user={author} />
			</div>

			{isMyMessage ? (
				<Popover
					content={
						<div className={styles["message__popover"]}>
							<DeleteFilled
								className={styles["popover__icon"]}
								onClick={() => {
									handleRemoveMessage(_id);
								}}
							/>
							<EditOutlined className={styles["popover__icon"]} />
						</div>
					}
					trigger="click"
				>
					<div className={styles["message__content"]}>
						{(audio || isTyping || message) && (
							<div className={styles["message__bubble"]}>
								{isTyping && (
									<div className={styles["message__typing"]}>
										<span></span>
										<span></span>
										<span></span>
									</div>
								)}
								{message && <p className={styles["message__text"]}>{message}</p>}
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

						{createdAt && <span className={styles["message__date"]}>{getMessageDate(createdAt)}</span>}

						<IconRead
							className={styles["message__checked-icon"]}
							isMyMessage={isMyMessage}
							isTyping={isTyping}
							isRead={false}
						/>
					</div>
				</Popover>
			) : (
				<div className={styles["message__content"]}>
					{(audio || isTyping || message) && (
						<div className={styles["message__bubble"]}>
							{isTyping && (
								<div className={styles["message__typing"]}>
									<span></span>
									<span></span>
									<span></span>
								</div>
							)}
							{message && <p className={styles["message__text"]}>{message}</p>}
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

					{createdAt && <span className={styles["message__date"]}>{getMessageDate(createdAt)}</span>}

					<IconRead
						className={styles["message__checked-icon"]}
						isMyMessage={isMyMessage}
						isTyping={isTyping}
						isRead={false}
					/>
				</div>
			)}
		</div>
	);
};

export default Message;
