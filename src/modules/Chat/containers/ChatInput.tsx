import { FC, ReactElement, ChangeEvent, KeyboardEvent, RefObject, Dispatch, SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";

// components
import BaseChatInput from "../components/ChatInput";

// selector
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// types
import { IMessageValue } from ".";

type ChatInputProps = {
	inputRef: RefObject<HTMLDivElement>;
	chatInputRef: RefObject<HTMLDivElement>;
	triggerRef: RefObject<SVGSVGElement>;
	nodeRef: RefObject<HTMLDivElement>;
	messageValue: IMessageValue;
	showEmojis: boolean;
	setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
	toggleEmojiModal: (flag: boolean) => void;
	cursorInput: () => void;
	clearInput: () => void;
	handleSendMessage: () => void;
	handleEditMessage: (id: string, message: string) => void;
	handleRemoveMessage: (id: string) => void;
};

const ChatInput: FC<ChatInputProps> = (props): ReactElement => {
	const {
		messageValue,
		inputRef,
		chatInputRef,
		triggerRef,
		nodeRef,
		showEmojis,
		setMessageValue,
		toggleEmojiModal,
		cursorInput,
		clearInput,
		handleSendMessage,
		handleEditMessage,
		handleRemoveMessage,
	} = props;
	const { currentDialogueId } = useSelector(dialogueSelector);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (triggerRef.current && triggerRef.current.contains(event.target as HTMLElement)) {
				return toggleEmojiModal(!showEmojis);
			}

			if (nodeRef.current && !nodeRef.current.contains(event.target as HTMLElement)) {
				return toggleEmojiModal(false);
			}
		};

		document.addEventListener("click", handleClickOutside, true);

		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [showEmojis]);

	useEffect(() => {
		if (currentDialogueId) {
			inputRef.current && inputRef.current.focus();
		}
	}, [currentDialogueId]);

	useEffect(() => {
		if (messageValue.id && messageValue.value.trim().length && inputRef.current) {
			inputRef.current.textContent = messageValue.value;
			inputRef.current.focus();
			cursorInput();
		}
	}, [messageValue.id]);

	const handleChangeSearchValue = (e: ChangeEvent<HTMLDivElement>) => {
		setMessageValue((prevState) => ({
			...prevState,
			value: e.target.textContent ? e.target.textContent.trim() : "",
		}));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}

		if (e.key === "Enter" && messageValue.value.trim().length) {
			if (messageValue.type === "create") {
				sendMessage();
			} else if (messageValue.type === "edit") {
				editMessage();
			}
		}
	};

	const sendMessage = () => {
		handleSendMessage();
		clearInput();
	};

	const editMessage = () => {
		if (messageValue.id) {
			handleEditMessage(messageValue.id, messageValue.value);
			clearInput();
		}
	};

	const removeMessage = () => {
		if (messageValue.id) {
			handleRemoveMessage(messageValue.id);
			clearInput();
		}
	};

	return (
		<BaseChatInput
			messageValue={messageValue}
			triggerRef={triggerRef}
			inputRef={inputRef}
			chatInputRef={chatInputRef}
			handleChangeSearchValue={handleChangeSearchValue}
			handleKeyDown={handleKeyDown}
			sendMessage={sendMessage}
			editMessage={editMessage}
			removeMessage={removeMessage}
		/>
	);
};

export default ChatInput;
