import { ChangeEvent, FC, ReactElement, KeyboardEvent, RefObject } from "react";

// mui components
import { Box } from "@mui/material";

// style
import styles from "./ChatInput.module.scss";

// classnames
import cn from "classnames";

// mui icons
import {
	SentimentSatisfiedAltRounded,
	MicRounded,
	CameraAltRounded,
	SendRounded,
	CheckCircleRounded,
	DeleteRounded,
} from "@mui/icons-material";

// types
import { IMessageValue } from "../../containers";

type ChatInputProps = {
	messageValue: IMessageValue;
	triggerRef: RefObject<SVGSVGElement>;
	inputRef: RefObject<HTMLDivElement>;
	chatInputRef: RefObject<HTMLDivElement>;
	handleChangeSearchValue: (e: ChangeEvent<HTMLDivElement>) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
	sendMessage: () => void;
	editMessage: () => void;
	removeMessage: () => void;
};

const ChatInput: FC<ChatInputProps> = (props): ReactElement => {
	const {
		messageValue,
		triggerRef,
		inputRef,
		chatInputRef,
		handleChangeSearchValue,
		handleKeyDown,
		sendMessage,
		editMessage,
		removeMessage,
	} = props;
	return (
		<Box className={styles["chat-input"]} ref={chatInputRef}>
			<Box className={styles["input-wrapper"]}>
				<SentimentSatisfiedAltRounded
					className={cn(styles["input-wrapper__icon"], styles["input-wrapper__smile"])}
					ref={triggerRef}
				/>
				<Box
					contentEditable="true"
					className={styles["input"]}
					onInput={handleChangeSearchValue}
					onKeyDown={handleKeyDown}
					ref={inputRef}
				></Box>
				<Box className={styles["input-wrapper__actions"]}>
					<CameraAltRounded className={cn(styles["input-wrapper__icon"], styles["input-wrapper__camera"])} />
					{messageValue.type === "create" ? (
						messageValue.value.trim().length ? (
							<SendRounded
								className={cn(styles["input-wrapper__icon"], styles["input-wrapper__send"])}
								onClick={sendMessage}
							/>
						) : (
							<MicRounded className={cn(styles["input-wrapper__icon"], styles["input-wrapper__audio"])} />
						)
					) : messageValue.value.trim().length ? (
						<CheckCircleRounded
							className={cn(styles["input-wrapper__icon"], styles["input-wrapper__send"])}
							onClick={editMessage}
						/>
					) : (
						<DeleteRounded
							className={cn(styles["input-wrapper__icon"], styles["input-wrapper__audio"])}
							onClick={removeMessage}
						/>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default ChatInput;
