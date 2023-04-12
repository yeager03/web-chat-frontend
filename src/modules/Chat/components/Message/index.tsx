import { FC, ReactElement, MouseEvent } from "react";

// mui components
import { Popover, Box } from "@mui/material";

// mui icons
import { DeleteRounded, EditRounded } from "@mui/icons-material";

// components
import UserAvatar from "../../../../components/UserAvatar";
import IconRead from "../../../../components/IconRead";
import AudioMessage from "../AudioMessage";

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
	anchorEl: HTMLDivElement | null;
	open: boolean;
	handleRemoveMessage: (messageId: string) => void;
	handleOpen: (e: MouseEvent<HTMLDivElement>) => void;
	handleClose: () => void;
};

const Message: FC<MessageProps> = (props): ReactElement => {
	const {
		_id,
		author,
		message,
		createdAt,
		isTyping,
		isRead,
		attachments,
		audio,
		anchorEl,
		open,
		handleRemoveMessage,
		handleOpen,
		handleClose,
	} = props;
	const { user } = useAuth();
	const isMyMessage = user?._id === author._id;

	return (
		<Box
			className={cn(styles["message"], {
				[styles["message_my-message"]]: isMyMessage,
				[styles["message_typing"]]: isTyping,
				[styles["message_image"]]: attachments?.length === 1,
				[styles["message_audio"]]: audio,
			})}
		>
			<Box className={styles["message__avatar"]}>
				<UserAvatar user={author} />
			</Box>

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			>
				<Box className={styles["message__popover"]}>
					<DeleteRounded
						className={styles["popover__icon"]}
						onClick={() => {
							handleRemoveMessage(_id);
						}}
					/>
					<EditRounded className={styles["popover__icon"]} />
				</Box>
			</Popover>

			<Box
				className={styles["message__content"]}
				onClick={(e) => {
					if (!isMyMessage) {
						return;
					}
					handleOpen(e);
				}}
			>
				{(audio || isTyping || message) && (
					<Box className={styles["message__bubble"]}>
						{isTyping && (
							<Box className={styles["message__typing"]}>
								<span></span>
								<span></span>
								<span></span>
							</Box>
						)}
						{message && <p className={styles["message__text"]}>{message}</p>}
						{audio && <AudioMessage audio={audio} />}
					</Box>
				)}

				{attachments && (
					<Box className={styles["message__attachments"]}>
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
					</Box>
				)}

				{createdAt && <span className={styles["message__date"]}>{getMessageDate(createdAt)}</span>}

				<IconRead
					className={styles["message__checked-icon"]}
					isMyMessage={isMyMessage}
					isTyping={isTyping}
					isRead={false}
				/>
			</Box>
		</Box>
	);
};

export default Message;
