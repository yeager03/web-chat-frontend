import { FC, ReactElement, ChangeEvent, KeyboardEvent, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store";

// components
import BaseChatInput from "../components/ChatInput";

// socket
import socket from "../../../core/socket";

// selector
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// actions
import { createMessage } from "../../../store/slices/message/messageActions";

// types
import type { InputRef } from "antd";

export type Emoji = {
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
};

const ChatInput: FC = (): ReactElement => {
	const [messageValue, setMessageValue] = useState<string>("");
	const [showEmojis, setShowEmojis] = useState<boolean>(false);

	const { currentDialogueId } = useSelector(dialogueSelector);

	const inputRef = useRef<InputRef>(null);
	const smileRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const element = inputRef.current;

		if (element) {
			inputRef.current.focus();
		}
	}, [currentDialogueId]);

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			const _event = e as MouseEvent & {
				composedPath: () => Node[];
			};

			if (smileRef.current && !_event.composedPath().includes(smileRef.current)) {
				setShowEmojis(false);
				inputRef.current?.focus();
			}
		};

		document.body.addEventListener("click", handleOutsideClick);

		return () => {
			document.body.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	const handleChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
		setMessageValue(e.target.value);
	};

	const handleClickShowEmojis = () => {
		setShowEmojis(!showEmojis);
	};

	const handleClickEmoji = (emoji: Emoji) => {
		setMessageValue((messageValue) => messageValue + emoji.native);
		setShowEmojis(false);

		inputRef.current?.focus();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		socket.emit("typing", true);

		if (e.key === "Enter" && messageValue.trim()) {
			sendMessage();
		}
	};

	const sendMessage = () => {
		dispatch(
			createMessage({
				message: messageValue.trim(),
				dialogueId: currentDialogueId,
			})
		);
		setMessageValue("");
	};

	return (
		<BaseChatInput
			messageValue={messageValue}
			showEmojis={showEmojis}
			handleChangeSearchValue={handleChangeSearchValue}
			handleClickShowEmojis={handleClickShowEmojis}
			handleClickEmoji={handleClickEmoji}
			handleKeyDown={handleKeyDown}
			sendMessage={sendMessage}
			inputRef={inputRef}
			smileRef={smileRef}
		/>
	);
};

export default ChatInput;
