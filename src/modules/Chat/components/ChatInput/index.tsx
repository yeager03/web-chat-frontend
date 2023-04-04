import { ChangeEvent, FC, ReactElement, useState, KeyboardEvent, Ref, LegacyRef } from "react";

// antd components
import { TextField, Box, InputAdornment } from "@mui/material";

// style
import styles from "./ChatInput.module.scss";

// classnames
import cn from "classnames";

// mui icons
import { SentimentSatisfiedAltRounded } from "@mui/icons-material";

import { SmileOutlined, AudioOutlined, CameraOutlined, SendOutlined } from "@ant-design/icons";

// emoji
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

// types
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { Emoji } from "../../containers/ChatInput";

type ChatInputProps = {
	messageValue: string;
	showEmojis: boolean;
	handleChangeSearchValue: (e: ChangeEvent<HTMLInputElement>) => void;
	handleClickShowEmojis: () => void;
	handleClickEmoji: (emoji: Emoji) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	sendMessage: () => void;
	inputRef: Ref<HTMLInputElement>;
	smileRef: LegacyRef<HTMLDivElement>;
};

const ChatInput: FC<ChatInputProps> = (props): ReactElement => {
	const {
		messageValue,
		showEmojis,
		handleChangeSearchValue,
		handleClickShowEmojis,
		handleClickEmoji,
		handleKeyDown,
		sendMessage,
		inputRef,
		smileRef,
	} = props;

	return (
		<Box className={styles["chat-input"]}>
			<Box className={styles["chat-input__emoji"]}>
				{showEmojis && <Picker data={data} onEmojiSelect={handleClickEmoji} theme="light" locale="ru" />}
			</Box>
			{/* <Input
				addonBefore={
					<SmileOutlined onClick={handleClickShowEmojis} className={cn(styles["icon"], styles["smile-icon"])} />
				}
				addonAfter={
					<Box className={styles["input__actions"]}>
						<Upload {...uploadProps} className={cn(styles["icon"], styles["smile-camera"])}>
							<CameraOutlined />
						</Upload>
						{messageValue.trim() ? (
							<SendOutlined className={cn(styles["icon"], styles["smile-send"])} onClick={sendMessage} />
						) : (
							<AudioOutlined className={cn(styles["icon"], styles["smile-audio"])} />
						)}
					</Box>
				}
				size="large"
				value={messageValue}
				onChange={handleChangeSearchValue}
				onKeyDown={handleKeyDown}
				className={styles["input"]}
				ref={inputRef}
			/> */}

			<TextField
				fullWidth
				id="outlined-basic"
				placeholder="Ваше сообщение"
				variant="outlined"
				multiline
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SentimentSatisfiedAltRounded />
						</InputAdornment>
					),
				}}
				value={messageValue}
				onChange={handleChangeSearchValue}
				onKeyDown={handleKeyDown}
				className={styles["input"]}
				ref={inputRef}
			/>
		</Box>
	);
};

export default ChatInput;
