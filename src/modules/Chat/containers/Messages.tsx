import {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";

// hooks
import useAudio from "../../../context/context";

// dispatch
import { useAppDispatch } from "../../../store";

// socket
import { socket } from "../../../core/socket";

// components
import BaseMessages from "../components/Messages";

// selectors
import {
  decreaseUnreadMessageCount,
  dialogueSelector,
} from "../../../store/slices/dialogue/dialogueSlice";
import {
  messageSelector,
  setTyping,
} from "../../../store/slices/message/messageSlice";

// actions
import { getMessages } from "../../../store/slices/message/messageActions";

// types
import { Status } from "../../../models/Status";
import { IMessageValue } from ".";
import IUser from "../../../models/IUser";
import { IFile } from "../../../models/IMessage";
import { AudioFileStatus } from "../../../context/AudioProvider";

type MessagesProps = {
  status: Status;
  chatInputHeight: number;
  interlocutor: IUser | null;
  setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
  setUploadedFiles: Dispatch<SetStateAction<IFile[]>>;
  handleRemoveMessage: (id: string) => void;
  handleEditFiles: (files: IFile[]) => void;
};

type TypingResponse = {
  flag: boolean;
  interlocutorId: string;
  currentDialogueId: string;
};

const Messages: FC<MessagesProps> = (props): ReactElement => {
  const {
    status,
    chatInputHeight,
    interlocutor,
    setMessageValue,
    setUploadedFiles,
    handleRemoveMessage,
    handleEditFiles,
  } = props;

  const { currentDialogueId } = useSelector(dialogueSelector);
  const { messages, isTyping } = useSelector(messageSelector);
  const { addAudioFile } = useAudio();

  const messagesRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentDialogueId) {
      dispatch(getMessages(currentDialogueId));

      let timer: NodeJS.Timeout;

      socket.on("SERVER:TYPING_RESPONSE", (data: TypingResponse) => {
        if (currentDialogueId === data.currentDialogueId) {
          dispatch(setTyping(data.flag));

          timer = setTimeout(() => {
            dispatch(setTyping(false));
          }, 3000);
        }
      });

      socket.on("SERVER:UNREADMESSAGES_DESCREASE", (count: number) => {
        dispatch(decreaseUnreadMessageCount({ count, currentDialogueId }));
      });

      return () => {
        clearTimeout(timer);
        socket.off("SERVER:TYPING_RESPONSE");
        socket.off("SERVER:UNREADMESSAGES_DESCREASE");
      };
    }
  }, [currentDialogueId]);

  useEffect(() => {
    const element = messagesRef.current;

    let timeout: NodeJS.Timeout;

    if (element) {
      timeout = setTimeout(function () {
        element.scrollTo(0, element.scrollHeight);
      }, 120);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [messages, chatInputHeight, isTyping]);

  useEffect(() => {
    messages.forEach((message) => {
      message.files.forEach((file) => {
        if (file.type === "audio") {
          const audio = new Audio(file.url);
          audio.preload = "metadata";

          audio.onloadedmetadata = function () {
            addAudioFile({
              _id: file._id,
              title: file.fileName,
              status: AudioFileStatus.IDLE,
              duration:
                audio.duration < 1
                  ? Math.floor(audio.duration * 1000)
                  : Math.floor(audio.duration),
            });
          };
        }
      });
    });
  }, [messages]);

  return (
    <BaseMessages
      messages={messages}
      status={status}
      messagesRef={messagesRef}
      chatInputHeight={chatInputHeight}
      isTyping={isTyping}
      interlocutor={interlocutor}
      setMessageValue={setMessageValue}
      setUploadedFiles={setUploadedFiles}
      handleRemoveMessage={handleRemoveMessage}
      handleEditFiles={handleEditFiles}
    />
  );
};

export default Messages;
