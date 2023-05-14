import { FC, ReactElement, RefObject, Dispatch, SetStateAction } from "react";

// containers
import Messages from "../../containers/Messages";
import ChatInput from "../../containers/ChatInput";

// classnames
import cn from "classnames";

// styles
import styles from "./Chat.module.scss";

// mui components
import { Box, Typography } from "@mui/material";

// types
import { Status } from "../../../../models/Status";
import { IFile } from "../../../../models/IMessage";

// models
import IUser from "../../../../models/IUser";
import { Emoji, IMessageValue, IUploadedFile } from "../../containers";

// emoji
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type ChatProps = {
  interlocutor: IUser | null;
  status: Status;
  showEmojis: boolean;
  inputRef: RefObject<HTMLDivElement>;
  chatInputRef: RefObject<HTMLDivElement>;
  triggerRef: RefObject<SVGSVGElement>;
  nodeRef: RefObject<HTMLDivElement>;
  chatInputHeight: number;
  messageValue: IMessageValue;
  uploadedFiles: IFile[];
  setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
  setFiles: Dispatch<SetStateAction<IUploadedFile[]>>;
  setUploadedFiles: Dispatch<SetStateAction<IFile[]>>;
  toggleEmojiModal: (flag: boolean) => void;
  cursorInput: () => void;
  clearInput: () => void;
  handleClickEmoji: (emoji: Emoji) => void;
  handleSendMessage: () => void;
  handleEditMessage: () => void;
  handleRemoveMessage: (id: string) => void;
  handleEditFiles: (files: IFile[]) => void;
};

const Chat: FC<ChatProps> = (props): ReactElement => {
  const {
    interlocutor,
    status,
    showEmojis,
    inputRef,
    chatInputRef,
    chatInputHeight,
    triggerRef,
    nodeRef,
    messageValue,
    uploadedFiles,
    setMessageValue,
    setFiles,
    setUploadedFiles,
    toggleEmojiModal,
    clearInput,
    cursorInput,
    handleClickEmoji,
    handleSendMessage,
    handleEditMessage,
    handleRemoveMessage,
    handleEditFiles,
  } = props;

  return (
    <Box className={styles["chat"]}>
      {interlocutor && (
        <Box className={styles["chat__header"]}>
          <Typography className={styles["chat__header-title"]} variant="h3">
            {interlocutor.fullName}
          </Typography>
          <Box
            className={cn(styles["chat__header-status"], {
              [styles["chat__header-status_online"]]: interlocutor.isOnline,
            })}
          >
            <span className={styles["status"]}>
              {interlocutor.isOnline ? "онлайн" : "офлайн"}
            </span>
          </Box>
        </Box>
      )}

      <Messages
        interlocutor={interlocutor}
        status={status}
        chatInputHeight={chatInputHeight}
        setMessageValue={setMessageValue}
        handleRemoveMessage={handleRemoveMessage}
        handleEditFiles={handleEditFiles}
        setUploadedFiles={setUploadedFiles}
      />

      {status === "success" && (
        <>
          <ChatInput
            interlocutor={interlocutor}
            inputRef={inputRef}
            chatInputRef={chatInputRef}
            nodeRef={nodeRef}
            triggerRef={triggerRef}
            showEmojis={showEmojis}
            messageValue={messageValue}
            uploadedFiles={uploadedFiles}
            toggleEmojiModal={toggleEmojiModal}
            setFiles={setFiles}
            setUploadedFiles={setUploadedFiles}
            setMessageValue={setMessageValue}
            cursorInput={cursorInput}
            clearInput={clearInput}
            handleSendMessage={handleSendMessage}
            handleEditMessage={handleEditMessage}
            handleRemoveMessage={handleRemoveMessage}
          />

          {showEmojis && (
            <Box
              ref={nodeRef}
              className={styles["emoji"]}
              sx={{ bottom: `${chatInputHeight}px`, zIndex: 1000 }}
            >
              <Picker
                data={data}
                onEmojiSelect={handleClickEmoji}
                theme="light"
                locale="ru"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Chat;
