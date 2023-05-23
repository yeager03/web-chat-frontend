import { FC, ReactElement, RefObject, Dispatch, SetStateAction } from "react";

// classnames
import cn from "classnames";

// styles
import styles from "./Messages.module.scss";

// mui components
import { CircularProgress, Box, Typography } from "@mui/material";

// images
import ChooseDialogue from "../../../../assets/images/choose_dialogue.svg";

// components
import Message from "../../containers/Message";
import TypingMessage from "../TypingMessage";

// types
import { Status } from "../../../../models/Status";
import IMessage, { IFile } from "../../../../models/IMessage";
import { IMessageValue } from "../../containers";
import IUser from "../../../../models/IUser";

type MessagesProps = {
  messages: IMessage[];
  status: Status;
  messagesRef: RefObject<HTMLDivElement>;
  chatInputHeight: number;
  isTyping: boolean;
  interlocutor: IUser | null;
  messageValue: IMessageValue;
  setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
  setUploadedFiles: Dispatch<SetStateAction<IFile[]>>;
  handleRemoveMessage: (id: string) => void;
  handleEditFiles: (files: IFile[]) => void;
};

const Messages: FC<MessagesProps> = (props): ReactElement => {
  const {
    messages,
    status,
    messagesRef,
    chatInputHeight,
    isTyping,
    interlocutor,
    messageValue,
    setMessageValue,
    setUploadedFiles,
    handleRemoveMessage,
    handleEditFiles,
  } = props;

  const chooseDialogue =
    status === "idle" ? (
      <Box className={cn(styles["chat__empty"], styles["messages__choose"])}>
        <img src={ChooseDialogue} alt="Choose dialogue img" />
        <Typography>Выберите диалог</Typography>
      </Box>
    ) : null;

  const loading =
    status === "loading" ? (
      <Box className={styles["chat__empty"]}>
        <CircularProgress />
      </Box>
    ) : null;

  const emptyMessages =
    status === "success" && !messages.length ? (
      <Box className={styles["chat__empty"]}>
        <Typography>У вас пока нет сообщений</Typography>
      </Box>
    ) : null;

  const content =
    status === "success" && messages.length
      ? messages.map((message) => (
          <Message
            key={message["_id"]}
            {...message}
            setUploadedFiles={setUploadedFiles}
            setMessageValue={setMessageValue}
            messageValue={messageValue}
            handleRemoveMessage={handleRemoveMessage}
            handleEditFiles={handleEditFiles}
          />
        ))
      : null;

  const typing =
    status === "success" && messages.length && isTyping ? (
      <TypingMessage isTyping={isTyping} interlocutor={interlocutor} />
    ) : null;

  return (
    <Box
      className={cn(styles["chat__messages"], {
        [styles["chat__messages_empty"]]:
          chooseDialogue || loading || emptyMessages,
      })}
      ref={messagesRef}
      sx={{
        height: `calc(100% - 85px - ${chatInputHeight}px)`,
      }}
    >
      {chooseDialogue}
      {loading}
      {emptyMessages}
      {content}
      {typing}
    </Box>
  );
};

export default Messages;
