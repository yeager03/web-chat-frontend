import { FC, ReactElement, MouseEvent, Dispatch, SetStateAction } from "react";

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

// hooks
import useAuth from "../../../../hooks/useAuth";

// types
import IMessage, { IFile } from "../../../../models/IMessage";
import { IImage, IMessageValue } from "../../containers";

type MessageProps = IMessage & {
	isRead?: boolean;
	attachments?: any[];
	audio?: string;
	anchorEl: HTMLDivElement | null;
	open: boolean;
	handleOpen: (e: MouseEvent<HTMLDivElement>) => void;
	handleClose: () => void;
	setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
	setImages: Dispatch<SetStateAction<IImage[]>>;
	handleRemoveMessage: (id: string) => void;
	handleEditFiles: (files: IFile[]) => void;
};

const Message: FC<MessageProps> = (props): ReactElement => {
	const {
		_id,
		author,
		message,
		createdAt,
		isRead,
		isEdited,
		files,
		audio,
		anchorEl,
		open,
		handleOpen,
		handleClose,
		setMessageValue,
		setImages,
		handleRemoveMessage,
		handleEditFiles,
	} = props;
	const { user } = useAuth();
	const isMyMessage = user?._id === author._id;

	return (
		<Box
			className={cn(styles["message"], {
				[styles["message_my-message"]]: isMyMessage,
				[styles["message_image"]]: files.length <= 5 && !message,
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
					<EditRounded
						className={styles["popover__icon"]}
						onClick={() => {
							setMessageValue({ value: message, type: "edit", id: _id });
							if (files.length) {
								handleEditFiles(files);

								setImages(
									files.map((file) => {
										return {
											fileName: file.fileName,
											size: file.size,
											src: file.url,
										};
									})
								);
							}
							handleClose();
						}}
					/>
					<DeleteRounded
						className={styles["popover__icon"]}
						onClick={() => {
							handleRemoveMessage(_id);
							handleClose();
						}}
					/>
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
				{(audio || message) && (
					<Box className={styles["message__bubble"]}>
						{message && (
							<p className={styles["message__text"]}>
								{isEdited ? (
									<>
										{message}
										<b>(ред.)</b>
									</>
								) : (
									message
								)}
							</p>
						)}
						{audio && <AudioMessage audio={audio} />}
					</Box>
				)}

				{files && (
					<Box className={styles["message__attachments"]}>
						<ul className={styles["attachments-items"]}>
							{files.map((file) => {
								return (
									<li className={styles["attachment-item"]} key={file["_id"]}>
										<img
											src={file["url"]}
											alt={file["fileName"]}
											className={styles["attachment-item__image"]}
										/>
									</li>
								);
							})}
						</ul>
					</Box>
				)}

				{createdAt && <span className={styles["message__date"]}>{getMessageDate(createdAt)}</span>}

				<IconRead className={styles["message__checked-icon"]} isMyMessage={isMyMessage} isRead={isRead} />
			</Box>
		</Box>
	);
};

export default Message;
