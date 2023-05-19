import { FC, ReactElement, useLayoutEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseChat from "../components/Chat";

// actions
import {
  createMessage,
  editMessage,
  deleteMessage,
} from "../../../store/slices/message/messageActions";

// hooks
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import usePrevious from "../../../hooks/usePrevious";

// selectors
import { messageSelector } from "../../../store/slices/message/messageSlice";
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// types
import { IFile } from "../../../models/IMessage";

export interface IUploadedFile {
  _id: string;
  type: "image" | "audio";
  file: File;
}

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

  const [files, setFiles] = useState<IUploadedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);

  const inputRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<SVGSVGElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLDivElement>(null);

  const messageHeightValue = useDebounce(messageValue, 500);

  const prevMessageValue = usePrevious<string, string>(
    messageValue.value,
    messageValue.id
  );
  const prevMessageUploadedFilesSize = usePrevious<number, string>(
    uploadedFiles.reduce((prev, file) => prev + file.size, 0),
    messageValue.id
  );

  const dispatch = useAppDispatch();
  const interlocutor = currentDialogue?.members.find(
    (member) => member._id !== user?._id
  );

  useLayoutEffect(() => {
    if (chatInputRef.current) {
      setChatInputHeight(chatInputRef.current.offsetHeight);
    }
  }, [messageHeightValue, uploadedFiles]);

  /* Input  */
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

  /* Emoji  */
  const toggleEmojiModal = (flag: boolean) => {
    setShowEmojis(flag);
  };

  const handleClickEmoji = (emoji: Emoji) => {
    setMessageValue((prevState) => ({
      ...prevState,
      value: messageValue.value + emoji.native.toString(),
    }));
    const input = inputRef.current;

    if (input) {
      input.textContent = input.textContent + emoji.native;
      toggleEmojiModal(false);
      cursorInput();
    }
  };

  /* Send message, edit message, remove message */
  const handleSendMessage = () => {
    if (user && interlocutor) {
      const formData = new FormData();
      const data: Record<string, string> = {
        from: user._id,
        to: interlocutor._id,
        messageText: messageValue.value.trim(),
        dialogueId: currentDialogueId,
      };

      for (let key in data) {
        formData.append(key, data[key]);
      }

      for (let item of files) {
        formData.append("files", item.file);
      }

      dispatch(createMessage(formData));
    }
  };

  const handleEditMessage = () => {
    if (
      messageValue.value !== prevMessageValue ||
      uploadedFiles.reduce((prev, file) => prev + file.size, 0) !==
        prevMessageUploadedFilesSize
    ) {
      const formData = new FormData();
      formData.append("messageId", messageValue.id);
      formData.append("messageText", messageValue.value);

      for (let item of files) {
        formData.append("files", item.file);
      }

      dispatch(
        editMessage({
          messageId: messageValue.id,
          messageText: messageValue.value,
          files: uploadedFiles,
          formData,
        })
      );
    }
  };

  const handleRemoveMessage = (messageId: string) =>
    dispatch(deleteMessage(messageId));

  const handleEditFiles = async (files: IFile[]) => {
    if (!files.length) return;

    const editedFiles: IUploadedFile[] = await Promise.all(
      files.map(async (file) => {
        const response = await fetch(file.url);
        const blob = await response.blob();

        return {
          _id: file._id,
          type: file.type,
          file: new File([blob], file.fileName, {
            type: `${file.type}/${blob.type.split("/")[1]}`,
          }),
        };
      })
    );

    setFiles(editedFiles);
    setUploadedFiles(files);
  };

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
      uploadedFiles={uploadedFiles}
      toggleEmojiModal={toggleEmojiModal}
      setMessageValue={setMessageValue}
      setFiles={setFiles}
      setUploadedFiles={setUploadedFiles}
      clearInput={clearInput}
      cursorInput={cursorInput}
      handleClickEmoji={handleClickEmoji}
      handleSendMessage={handleSendMessage}
      handleEditMessage={handleEditMessage}
      handleRemoveMessage={handleRemoveMessage}
      handleEditFiles={handleEditFiles}
    />
  );
};

export default Chat;
