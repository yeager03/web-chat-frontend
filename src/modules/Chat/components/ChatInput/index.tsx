import { ChangeEvent, FC, ReactElement, KeyboardEvent, Ref, MouseEvent } from "react";

// mui components
import { Box, Popover } from "@mui/material";

// style
import styles from "./ChatInput.module.scss";

// classnames
import cn from "classnames";

// mui icons
import { SentimentSatisfiedAltRounded, MicRounded, CameraAltRounded, SendRounded } from "@mui/icons-material";

// emoji
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

// types
import { Emoji } from "../../containers/ChatInput";

type ChatInputProps = {
	messageValue: string;
	showEmojis: boolean;
	anchorEl: Element | null;
	handleChangeSearchValue: (e: ChangeEvent<HTMLDivElement>) => void;
	handleClick: (e: MouseEvent<Element>) => void;
	handleClose: () => void;
	handleClickEmoji: (emoji: Emoji) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
	sendMessage: () => void;
	inputRef: Ref<HTMLDivElement>;
};

const ChatInput: FC<ChatInputProps> = (props): ReactElement => {
	const {
		messageValue,
		showEmojis,
		anchorEl,
		handleChangeSearchValue,
		handleClick,
		handleClose,
		handleClickEmoji,
		handleKeyDown,
		sendMessage,
		inputRef,
	} = props;
	return (
		<Box className={styles["chat-input"]}>
			<Popover
				id={"simple-popover"}
				open={showEmojis}
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
				<Picker data={data} onEmojiSelect={handleClickEmoji} theme="light" locale="ru" />
			</Popover>
			<Box className={styles["input-wrapper"]}>
				<SentimentSatisfiedAltRounded
					className={cn(styles["input-wrapper__icon"], styles["input-wrapper__smile"])}
					onClick={handleClick}
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
					{messageValue.trim().length ? (
						<SendRounded
							className={cn(styles["input-wrapper__icon"], styles["input-wrapper__send"])}
							onClick={sendMessage}
						/>
					) : (
						<MicRounded className={cn(styles["input-wrapper__icon"], styles["input-wrapper__audio"])} />
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default ChatInput;
