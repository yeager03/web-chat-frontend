import { FC, ReactElement, useLayoutEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseChat from "../components/Chat";

// actions
import { createMessage, editMessage, deleteMessage } from "../../../store/slices/message/messageActions";

// hooks
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import usePrevious from "../../../hooks/usePrevious";

// selectors
import { messageSelector } from "../../../store/slices/message/messageSlice";
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

export interface IMessageValue {
	value: string;
	type: "create" | "edit";
	id: string;
}

export type Emoji = {
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
};

const Chat: FC = (): ReactElement => {
	const { status } = useSelector(messageSelector);
	const { currentDialogue, currentDialogueId } = useSelector(dialogueSelector);
	const { user } = useAuth();

	const [messageValue, setMessageValue] = useState<IMessageValue>({
		value: "",
		type: "create",
		id: "",
	});
	const [chatInputHeight, setChatInputHeight] = useState<number>(76);
	const [showEmojis, setShowEmojis] = useState<boolean>(false);

	const inputRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<SVGSVGElement>(null);
	const nodeRef = useRef<HTMLDivElement>(null);
	const chatInputRef = useRef<HTMLDivElement>(null);

	const heightValue = useDebounce(messageValue, 500);
	const prevMessageValue = usePrevious<string, string>(messageValue.value, messageValue.id);

	const dispatch = useAppDispatch();
	const interlocutor = currentDialogue?.members.find((member) => member._id !== user?._id);

	useLayoutEffect(() => {
		if (chatInputRef.current) {
			setChatInputHeight(chatInputRef.current.offsetHeight);
		}
	}, [heightValue]);

	const cursorInput = () => {
		if (inputRef.current) {
			const range = document.createRange();
			range.selectNodeContents(inputRef.current);
			range.collapse(false);
			const sel = window.getSelection();
			sel && sel.removeAllRanges();
			sel && sel.addRange(range);
		}
	};

	const clearInput = () => {
		if (inputRef.current) {
			inputRef.current.textContent = "";
			setMessageValue({ type: "create", value: "", id: "" });
		}
	};

	const handleClickEmoji = (emoji: Emoji) => {
		setMessageValue((prevState) => ({ ...prevState, value: messageValue.value + emoji.native.toString() }));
		const input = inputRef.current;

		if (input) {
			input.textContent = input.textContent + emoji.native;
			toggleEmojiModal(false);
			cursorInput();
		}
	};

	const toggleEmojiModal = (flag: boolean) => {
		setShowEmojis(flag);
	};

	const handleSendMessage = () => {
		if (user && interlocutor) {
			dispatch(
				createMessage({
					from: user._id,
					to: interlocutor._id,
					messageText: messageValue.value.trim(),
					dialogueId: currentDialogueId,
				})
			);
		}
	};

	const handleEditMessage = (messageId: string, messageText: string) =>
		messageText !== prevMessageValue &&
		dispatch(
			editMessage({
				messageId,
				messageText,
			})
		);

	const handleRemoveMessage = (messageId: string) => dispatch(deleteMessage(messageId));

	return (
		<BaseChat
			interlocutor={interlocutor ? interlocutor : null}
			status={status}
			showEmojis={showEmojis}
			inputRef={inputRef}
			chatInputRef={chatInputRef}
			chatInputHeight={chatInputHeight}
			nodeRef={nodeRef}
			triggerRef={triggerRef}
			messageValue={messageValue}
			toggleEmojiModal={toggleEmojiModal}
			setMessageValue={setMessageValue}
			clearInput={clearInput}
			cursorInput={cursorInput}
			handleClickEmoji={handleClickEmoji}
			handleSendMessage={handleSendMessage}
			handleEditMessage={handleEditMessage}
			handleRemoveMessage={handleRemoveMessage}
		/>
	);
};

export default Chat;
