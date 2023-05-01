import {
  FC,
  ReactElement,
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  Dispatch,
  SetStateAction,
  ClipboardEvent,
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";

// uuid
import { v4 as uuidv4 } from "uuid";

// hooks
import useDebounce from "../../../hooks/useDebounce";

// socket
import { socket } from "../../../core/socket";

// components
import BaseChatInput from "../components/ChatInput";

// selector
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// types
import { IFileImage, IMessageValue } from ".";
import IUser from "../../../models/IUser";
import { IFile } from "../../../models/IMessage";

// notification
import getNotification from "../../../utils/notification";

//patterns
import getPatterns from "../../../utils/validationPatterns";

// is valid url
import isValidUrl from "../../../utils/validUrl";

const isUrlHasImage = (url: string) => {
  const img = new Image();
  img.src = url;

  return new Promise((resolve) => {
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
  });
};

type ChatInputProps = {
  inputRef: RefObject<HTMLDivElement>;
  chatInputRef: RefObject<HTMLDivElement>;
  triggerRef: RefObject<SVGSVGElement>;
  nodeRef: RefObject<HTMLDivElement>;
  messageValue: IMessageValue;
  showEmojis: boolean;
  interlocutor: IUser | null;
  images: IFile[];
  setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
  setImageFiles: Dispatch<SetStateAction<IFileImage[]>>;
  setImages: Dispatch<SetStateAction<IFile[]>>;
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
      if (
        triggerRef.current &&
        triggerRef.current.contains(event.target as HTMLElement)
      ) {
        return toggleEmojiModal(!showEmojis);
      }

      if (
        nodeRef.current &&
        !nodeRef.current.contains(event.target as HTMLElement)
      ) {
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
    if (
      messageValue.id &&
      messageValue.value.trim().length &&
      inputRef.current
    ) {
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

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    if (
      e.key === "Enter" &&
      (messageValue.value.trim().length || images.length)
    ) {
      if (messageValue.type === "create") {
        sendMessage();
      } else if (messageValue.type === "edit") {
        editMessage();
      }
    }
  };

  const handleOnPaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length) {
      e.preventDefault();

      const file = e.clipboardData.files[0];

      if (file.type.match(getPatterns().image)) {
        if (file.size <= 5000000) {
          const validImageFile = { _id: uuidv4(), file };

          setImageFiles((prevState) => [...prevState, validImageFile]);
          setImages((prevState) => [
            ...prevState,
            {
              _id: validImageFile._id,
              url: URL.createObjectURL(validImageFile.file),
              fileName: file.name,
              size: file.size,
              extension: file.type.split("/")[1],
            },
          ]);
          inputRef.current && inputRef.current.focus();
          return;
        } else {
          return getNotification(
            "Размер картинки не должен превышать 5 мегабайт!",
            "error"
          );
        }
      } else {
        return getNotification(
          "Выбранный вами файл, не является картинкой!",
          "error"
        );
      }
    } else {
      const referenceValue = e.clipboardData.getData("text");

      if (isValidUrl(referenceValue)) {
        if (await isUrlHasImage(referenceValue)) {
          e.preventDefault();

          const response = await fetch(referenceValue);

          if (response.status === 200) {
            const blob = await response.blob();
            const image = {
              _id: uuidv4(),
              file: new File(
                [blob],
                `image${blob.size}.${blob.type.split("/")[1]}`,
                {
                  type: blob.type,
                }
              ),
            };

            setImageFiles((prevState) => [...prevState, image]);
            setImages((prevState) => [
              ...prevState,
              {
                _id: image._id,
                url: URL.createObjectURL(image.file),
                fileName: image.file.name,
                size: image.file.size,
                extension: image.file.type.split("/")[1],
              },
            ]);
            inputRef.current && inputRef.current.focus();
            return;
          }
        }
      }
    }
  };

  const handleFilePick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const validImageFiles: IFileImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.type.match(getPatterns().image)) {
          if (file.size <= 5000000) {
            validImageFiles.push({
              _id: uuidv4(),
              file,
            });
          } else {
            return getNotification(
              "Размер картинки не должен превышать 5 мегабайт!",
              "error"
            );
          }
        } else {
          return getNotification(
            "Выбранный вами файл, не является картинкой!",
            "error"
          );
        }
      }

      if (validImageFiles.length <= 5) {
        setImageFiles((prevState) => [...prevState, ...validImageFiles]);
        setImages((prevState) => [
          ...prevState,
          ...validImageFiles.map(({ _id, file }) => {
            const url = URL.createObjectURL(file);

            return {
              _id,
              url,
              fileName: file.name,
              size: file.size,
              extension: file.type.split("/")[1],
            };
          }),
        ]);
        inputRef.current && inputRef.current.focus();
        return;
      } else {
        return getNotification("Больше 5 файлов нельзя загрузить!", "error");
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    setImageFiles((prevState) => prevState.filter(({ _id }) => _id !== id));
    setImages((prevState) => prevState.filter((image) => image._id !== id));
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
      handleOnPaste={handleOnPaste}
      sendMessage={sendMessage}
      editMessage={editMessage}
      removeMessage={removeMessage}
    />
  );
};

export default ChatInput;
