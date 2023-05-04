import {
  ChangeEvent,
  ClipboardEvent,
  Dispatch,
  FC,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

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

// actions
import {
  IMediaFile,
  MediaFileStatus,
  setMediaFiles,
} from "../../../store/slices/audio/audioSlice";

// types
import { IMessageValue, IUploadedFile } from ".";
import IUser from "../../../models/IUser";
import { IFile } from "../../../models/IMessage";

// notification
import getNotification from "../../../utils/notification";

// patterns
import getPatterns from "../../../utils/validationPatterns";

// is valid url
import isValidUrl from "../../../utils/validUrl";
import AudioProvider from "../../../context/AudioProvider";

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
  uploadedFiles: IFile[];
  setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
  setFiles: Dispatch<SetStateAction<IUploadedFile[]>>;
  setUploadedFiles: Dispatch<SetStateAction<IFile[]>>;
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
    uploadedFiles,
    setMessageValue,
    setFiles,
    setUploadedFiles,
    toggleEmojiModal,
    cursorInput,
    clearInput,
    handleSendMessage,
    handleEditMessage,
    handleRemoveMessage,
  } = props;
  const { currentDialogueId } = useSelector(dialogueSelector);

  const debounceMessage = useDebounce(messageValue.value, 2000);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (uploadedFiles.length) {
      uploadedFiles.forEach((file) => {
        if (file.type === "audio") {
          dispatch(
            setMediaFiles({
              _id: file._id,
              title: file.fileName,
              status: MediaFileStatus.IDLE,
              duration: 0,
            })
          );
        }
      });
    }
  }, [uploadedFiles]);

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
      (messageValue.value.trim().length || uploadedFiles.length)
    ) {
      if (messageValue.type === "create") {
        sendMessage();
      } else if (messageValue.type === "edit") {
        editMessage();
      }
    }
  };

  // TODO:
  const handleOnPaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length) {
      e.preventDefault();

      const file = e.clipboardData.files[0];

      if (file.type.match(getPatterns().image)) {
        if (file.size <= 5000000) {
          const validImageFile: IUploadedFile = {
            _id: uuidv4(),
            type: "image",
            file,
          };

          setFiles((prevState) => [...prevState, validImageFile]);
          setUploadedFiles((prevState) => [
            ...prevState,
            {
              _id: validImageFile._id,
              url: URL.createObjectURL(validImageFile.file),
              fileName: file.name,
              size: file.size,
              extension: file.type.split("/")[1],
              type: "image",
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
            const image: IUploadedFile = {
              _id: uuidv4(),
              type: "image",
              file: new File(
                [blob],
                `image${blob.size}.${blob.type.split("/")[1]}`,
                {
                  type: blob.type,
                }
              ),
            };

            setFiles((prevState) => [...prevState, image]);
            setUploadedFiles((prevState) => [
              ...prevState,
              {
                _id: image._id,
                url: URL.createObjectURL(image.file),
                fileName: image.file.name,
                size: image.file.size,
                extension: image.file.type.split("/")[1],
                type: "image",
              },
            ]);
            inputRef.current && inputRef.current.focus();
            return;
          }
        }
      }
    }
  };

  // TODO:
  const handleFilePick = (e: ReactMouseEvent<SVGSVGElement>) => {
    const type = e.currentTarget.getAttribute("file-type");

    switch (type) {
      case "image":
        imageInputRef.current && imageInputRef.current.click();
        break;
      case "audio":
        audioInputRef.current && audioInputRef.current.click();
        break;
    }
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const type = e.target.getAttribute("file-type");

    if (uploadedFiles.length >= 5) {
      return getNotification("Нельзя загрузить больше 5 файлов!", "error");
    }

    if (files) {
      const validUploadFiles: IUploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split("/")[0];

        switch (type) {
          case "image":
            if (file.type.match(getPatterns().image)) {
              if (file.size <= 5000000) {
                validUploadFiles.push({
                  _id: uuidv4(),
                  type: fileType,
                  file,
                } as IUploadedFile);
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
            break;
          case "audio":
            if (file.type.match(getPatterns().audio)) {
              if (file.size <= 10000000) {
                validUploadFiles.push({
                  _id: uuidv4(),
                  type: fileType,
                  file,
                } as IUploadedFile);
              } else {
                return getNotification(
                  "Размер аудиозаписи не должен превышать 10 мегабайт!",
                  "error"
                );
              }
            } else {
              return getNotification(
                "Выбранный вами файл, не является аудиозаписью!",
                "error"
              );
            }
            break;
        }
      }

      if (validUploadFiles.length <= 5) {
        setFiles((prevState) => [...prevState, ...validUploadFiles]);
        setUploadedFiles((prevState) => [
          ...prevState,
          ...validUploadFiles.map(({ _id, file, type }) => {
            return {
              _id,
              type,
              fileName: file.name,
              url: URL.createObjectURL(file),
              size: file.size,
              extension: file.type.split("/")[1],
            };
          }),
        ]);

        inputRef.current && inputRef.current.focus();
        return;
      } else {
        return getNotification("Нельзя загрузить больше 5 файлов!", "error");
      }
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevState) => prevState.filter(({ _id }) => _id !== id));
    setUploadedFiles((prevState) =>
      prevState.filter((file) => file._id !== id)
    );
  };

  const sendMessage = () => {
    if (uploadedFiles.length <= 5) {
      handleSendMessage();
      clearInput();
      setFiles([]);
      setUploadedFiles([]);
      return;
    } else {
      return getNotification("Нелья отправить больше 5 файлов!", "error");
    }
  };

  const editMessage = () => {
    if (messageValue.id) {
      if (uploadedFiles.length <= 5) {
        handleEditMessage();
        clearInput();
        setFiles([]);
        setUploadedFiles([]);
        return;
      } else {
        return getNotification("Нелья отправить больше 5 файлов!", "error");
      }
    } else {
      return getNotification("Не найдено сообщение!", "error");
    }
  };

  const removeMessage = () => {
    if (messageValue.id) {
      handleRemoveMessage(messageValue.id);
      return;
    } else {
      return getNotification("Не найдено сообщение!", "error");
    }
  };

  return (
    <AudioProvider>
      <BaseChatInput
        messageValue={messageValue}
        triggerRef={triggerRef}
        imageInputRef={imageInputRef}
        audioInputRef={audioInputRef}
        inputRef={inputRef}
        chatInputRef={chatInputRef}
        uploadedFiles={uploadedFiles}
        handleChangeFile={handleChangeFile}
        handleFilePick={handleFilePick}
        handleRemoveFile={handleRemoveFile}
        handleChangeSearchValue={handleChangeSearchValue}
        handleKeyDown={handleKeyDown}
        handleOnPaste={handleOnPaste}
        sendMessage={sendMessage}
        editMessage={editMessage}
        removeMessage={removeMessage}
      />
    </AudioProvider>
  );
};

export default ChatInput;
