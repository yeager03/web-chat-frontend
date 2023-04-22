import {
	FC,
	ReactElement,
	ChangeEvent,
	KeyboardEvent,
	RefObject,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
} from "react";
import { useSelector } from "react-redux";

// hooks
import useDebounce from "../../../hooks/useDebounce";

// socket
import { socket } from "../../../core/socket";

// components
import BaseChatInput from "../components/ChatInput";

// selector
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// types
import { IImage, IMessageValue } from ".";
import IUser from "../../../models/IUser";

// notification
import getNotification from "../../../utils/notification";

// reg exp
const imageTypeRegex = /image\/(png|jpg|jpeg|svg|web|gif)/gm;

type ChatInputProps = {
	inputRef: RefObject<HTMLDivElement>;
	chatInputRef: RefObject<HTMLDivElement>;
	triggerRef: RefObject<SVGSVGElement>;
	nodeRef: RefObject<HTMLDivElement>;
	messageValue: IMessageValue;
	showEmojis: boolean;
	interlocutor: IUser | null;
	images: IImage[];
	setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
	setImageFiles: Dispatch<SetStateAction<File[]>>;
	setImages: Dispatch<SetStateAction<IImage[]>>;
	toggleEmojiModal: (flag: boolean) => void;
	cursorInput: () => void;
	clearInput: () => void;
	handleSendMessage: () => void;
	handleEditMessage: () => void;
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
		interlocutor,
		images,
		setMessageValue,
		setImageFiles,
		setImages,
		toggleEmojiModal,
		cursorInput,
		clearInput,
		handleSendMessage,
		handleEditMessage,
		handleRemoveMessage,
	} = props;
	const { currentDialogueId } = useSelector(dialogueSelector);

	const debounceMessage = useDebounce(messageValue.value, 2000);
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	useEffect(() => {
		if (debounceMessage.trim().length) {
			let timer: NodeJS.Timeout;

			timer = setTimeout(() => {
				socket.emit("CLIENT:MESSAGE_TYPING", {
					flag: true,
					currentDialogueId,
					interlocutorId: interlocutor?._id,
				});
			}, 1000);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [debounceMessage]);

	const handleChangeSearchValue = (e: ChangeEvent<HTMLDivElement>) => {
		setMessageValue((prevState) => ({
			...prevState,
			value: e.target.textContent ? e.target.textContent.trim() : "",
		}));
	};

	const handleFilePick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (files) {
			const validImageFiles: File[] = [];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				console.log(file);

				if (file.type.match(imageTypeRegex)) {
					if (file.size <= 5000000) {
						validImageFiles.push(file);
					} else {
						return getNotification("Размер картинки не должен превышать 5 мегабайт!", "error");
					}
				} else {
					return getNotification("Выбранный вами файл, не является картинкой!", "error");
				}
			}

			if (validImageFiles.length <= 5) {
				setImageFiles((prevState) => [...prevState, ...validImageFiles]);
				setImages((prevState) => [
					...prevState,
					...validImageFiles.map((file) => ({
						fileName: file.name,
						src: URL.createObjectURL(file),
						size: file.size,
					})),
				]);
				return;
			} else {
				return getNotification("Больше 5 файлов нельзя загрузить!", "error");
			}
		}
	};

	const handleRemoveImage = (fileName: string) => {
		setImageFiles((prevState) => prevState.filter((file) => file.name !== fileName));
		setImages((prevState) => prevState.filter((image) => image.fileName !== fileName));
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
		setImageFiles([]);
		setImages([]);
	};

	const editMessage = () => {
		if (messageValue.id) {
			handleEditMessage();
			clearInput();
			setImageFiles([]);
			setImages([]);
		}
	};

	const removeMessage = () => {
		if (messageValue.id) {
			handleRemoveMessage(messageValue.id);
		}
	};

	return (
		<BaseChatInput
			messageValue={messageValue}
			triggerRef={triggerRef}
			fileInputRef={fileInputRef}
			inputRef={inputRef}
			chatInputRef={chatInputRef}
			images={images}
			handleChangeImage={handleChangeImage}
			handleFilePick={handleFilePick}
			handleRemoveImage={handleRemoveImage}
			handleChangeSearchValue={handleChangeSearchValue}
			handleKeyDown={handleKeyDown}
			sendMessage={sendMessage}
			editMessage={editMessage}
			removeMessage={removeMessage}
		/>
	);
};

export default ChatInput;
