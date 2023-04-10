import {
	FC,
	ReactElement,
	ChangeEvent,
	KeyboardEvent,
	useState,
	useRef,
	useEffect,
	MouseEvent,
	RefObject,
} from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../store";

// components
import BaseChatInput from "../components/ChatInput";

// hooks
import useDebounce from "../../../hooks/useDebounce";

// selector
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// actions
import { createMessage } from "../../../store/slices/message/messageActions";

// types
import { Status } from "../../../models/Status";

export type Emoji = {
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
};

type ChatInputProps = {
	messageValue: string;
	setMessageValue: (value: string) => void;
	chatInputRef: RefObject<HTMLDivElement>;
};

const ChatInput: FC<ChatInputProps> = (props): ReactElement => {
	const { messageValue, setMessageValue, chatInputRef } = props;
	const { currentDialogueId } = useSelector(dialogueSelector);

	const [anchorEl, setAnchorEl] = useState<Element | null>(null);

	const inputRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		inputRef.current && inputRef.current.focus();
	}, [currentDialogueId, anchorEl]);

	const handleClick = (event: MouseEvent<Element>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		inputRef.current && inputRef.current.focus();
	};

	const handleChangeSearchValue = (e: ChangeEvent<HTMLDivElement>) => {
		setMessageValue(e.target.textContent ? e.target.textContent.trim() : "");
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}

		if (e.key === "Enter" && messageValue.trim().length) {
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
		if (inputRef.current) {
			inputRef.current.textContent = "";
		}
	};

	const handleClickEmoji = (emoji: Emoji) => {
		setMessageValue(messageValue + emoji.native);

		const input = inputRef.current;

		if (input) {
			input.textContent = input.textContent + emoji.native;

			const range = document.createRange();
			range.selectNodeContents(input);
			range.collapse(false);

			const sel = window.getSelection();
			sel && sel.removeAllRanges();
			sel && sel.addRange(range);

			handleClose();
		}
	};

	return (
		<BaseChatInput
			messageValue={messageValue}
			showEmojis={Boolean(anchorEl)}
			anchorEl={anchorEl}
			handleChangeSearchValue={handleChangeSearchValue}
			handleClick={handleClick}
			handleClose={handleClose}
			handleClickEmoji={handleClickEmoji}
			handleKeyDown={handleKeyDown}
			sendMessage={sendMessage}
			inputRef={inputRef}
			chatInputRef={chatInputRef}
		/>
	);
};

export default ChatInput;
