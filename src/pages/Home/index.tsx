import { FC, ReactElement, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../store";

// modules
import Sidebar from "../../modules/SideBar";

// style
import styles from "./Home.module.scss";

// utils
import decryptionText from "../../utils/decryptionText";

// hooks
import useAuth from "../../hooks/useAuth";

// socket
import { connectSocket, socket } from "../../core/socket";

// sounds
import NotificationSound from "../../assets/sounds/requests_sound.mp3";
import MessageSound from "../../assets/sounds/message_sound.mp3";

// selectors
import {
  changeDialogueMessage,
  dialogueSelector,
  increaseUnreadMessageCount,
  readDialogueLastMessage,
  setCurrentDialogue,
  setCurrentDialogueId,
  socketChangeDialogueFriendStatus,
} from "../../store/slices/dialogue/dialogueSlice";

// actions
import {
  getFriends,
  getRequests,
} from "../../store/slices/friend/friendActions";
import {
  socketAddFriend,
  socketAddRequest,
  socketChangeFriendStatus,
} from "../../store/slices/friend/friendSlice";
import { getDialogues } from "../../store/slices/dialogue/dialogueActions";
import {
  setTyping,
  socketAddMessage,
  socketClearMessages,
  socketDeleteMessage,
  socketEditMessage,
  socketMessageRead,
} from "../../store/slices/message/messageSlice";

// types
import IMessage from "../../models/IMessage";
import IDialogue from "../../models/IDialogue";
import IUser from "../../models/IUser";

const Home: FC = (): ReactElement => {
  const { user } = useAuth();
  const { currentDialogueId, dialogues } = useSelector(dialogueSelector);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      connectSocket(user._id);
    }

    dispatch(getRequests());
    dispatch(getDialogues());
  }, []);

  useEffect(() => {
    socket.on(
      "SERVER:NEW_FRIEND_REQUEST",
      (recipientId: string, request: IUser) => {
        // если получатель мы
        if (user && user._id === recipientId) {
          dispatch(socketAddRequest(request));

          const audio = new Audio(NotificationSound);
          audio.autoplay = true;
          audio.volume = 0.25;
          audio.play().catch((error) => console.log(error));
        }
      }
    );

    socket.on(
      "SERVER:NEW_FRIEND_ACCEPT",
      (recipientId: string, friend: IUser) => {
        console.log("friend accept", friend._id);

        // если получатель мы
        if (user && user._id === recipientId) {
          dispatch(socketAddFriend(friend));
        }
      }
    );

    socket.on(
      "SERVER:FRIEND_REMOVE",
      (members: string[], dialogue: IDialogue | null) => {
        console.log("friend removed");

        if (user && members.includes(user._id)) {
          dispatch(getFriends());
          dispatch(getDialogues());

          if (dialogue && currentDialogueId === dialogue._id) {
            dispatch(setCurrentDialogueId(""));
            dispatch(setCurrentDialogue(null));
            dispatch(socketClearMessages());
            navigate("/dialogues", { replace: true });
          }
        }
      }
    );

    socket.on("SERVER:DIALOGUE_CREATED", (dialogue: IDialogue) => {
      if (user && dialogue.members.find((member) => member._id === user._id)) {
        dispatch(getDialogues());

        if (dialogue.lastMessage.author._id !== user._id) {
          const audio = new Audio(MessageSound);
          audio.autoplay = true;
          audio.volume = 0.25;
          audio.play().catch((error) => console.log(error));
        }
      }
    });

    socket.on(
      "SERVER:DIALOGUE_MESSAGE_UPDATE",
      (dialogueId: string, message: IMessage, clientRoomSize: number = 1) => {
        if (dialogues.find((dl) => dl._id === dialogueId)) {
          console.log("dialogue message changed");
          if (!message) {
            dispatch(getDialogues());
            dispatch(setCurrentDialogueId(""));
            dispatch(setCurrentDialogue(null));
            dispatch(socketClearMessages());
            navigate("/dialogues", { replace: true });
          } else {
            let lastMessageInfo;

            if (message.message && !message.isReference) {
              lastMessageInfo = decryptionText(message.message);
            } else if (message.message && message.isReference) {
              lastMessageInfo = "Ссылка";
            } else {
              const audioFiles = message.files.filter(
                (file) => file.type === "audio"
              );
              const imageFiles = message.files.filter(
                (file) => file.type === "image"
              );

              if (audioFiles.length && !imageFiles.length) {
                lastMessageInfo = "Аудио";
              } else if (imageFiles.length && !audioFiles.length) {
                lastMessageInfo = "Изображения";
              } else {
                lastMessageInfo = "Файлы";
              }
            }

            dispatch(
              changeDialogueMessage({
                dialogueId,
                message: {
                  ...message,
                  message: lastMessageInfo,
                },
              })
            );

            if (clientRoomSize > 1) {
              dispatch(readDialogueLastMessage(dialogueId));
            }
          }
        }
      }
    );

    socket.on(
      "SERVER:MESSAGE_CREATED",
      (message: IMessage, clientRoomSize: number = 1) => {
        if (dialogues.find((dl) => dl._id === String(message.dialogue))) {
          if (currentDialogueId === String(message.dialogue)) {
            dispatch(setTyping(false));
            dispatch(
              socketAddMessage({
                ...message,
                message: message.message ? decryptionText(message.message) : "",
              })
            );

            if (clientRoomSize > 1) {
              dispatch(socketMessageRead(message._id));
            }
          } else {
            if (user && message.author._id !== user._id) {
              const audio = new Audio(MessageSound);
              audio.autoplay = true;
              audio.volume = 0.25;
              audio.play().catch((error) => console.log(error));

              dispatch(increaseUnreadMessageCount(String(message.dialogue)));
            }
          }
        }
      }
    );

    socket.on("SERVER:MESSAGE_DELETED", (message: IMessage) => {
      console.log("message deleted");
      if (dialogues.find((dl) => dl._id === String(message.dialogue))) {
        if (currentDialogueId === String(message.dialogue)) {
          dispatch(socketDeleteMessage(message._id));
        }
      }
    });

    socket.on("SERVER:MESSAGE_EDITED", (message: IMessage) => {
      if (dialogues.find((dl) => dl._id === String(message.dialogue))) {
        if (currentDialogueId === String(message.dialogue)) {
          dispatch(
            socketEditMessage({
              messageId: message._id,
              messageText: message.message
                ? decryptionText(message.message)
                : "",
              files: message.files,
              formData: null,
            })
          );
        }
      }
    });

    socket.on(
      "SERVER:MESSAGES_READ",
      (messages: IMessage[], dialogueId: string) => {
        if (dialogues.find((dl) => dl._id === dialogueId)) {
          if (currentDialogueId === dialogueId) {
            messages.forEach(({ _id }) => {
              dispatch(socketMessageRead(_id));
            });
          }
          dispatch(readDialogueLastMessage(dialogueId));
        }
      }
    );

    return () => {
      socket.off("SERVER:NEW_FRIEND_REQUEST");
      socket.off("SERVER:NEW_FRIEND_ACCEPT");
      socket.off("SERVER:FRIEND_REMOVE");
      socket.off("SERVER:DIALOGUE_CREATED");
      socket.off("SERVER:DIALOGUE_MESSAGE_UPDATE");
      socket.off("SERVER:MESSAGE_CREATED");
      socket.off("SERVER:MESSAGE_DELETED");
      socket.off("SERVER:MESSAGE_EDITED");
      socket.off("SERVER:MESSAGES_READ");
    };
  }, [currentDialogueId, dialogues]);

  useEffect(() => {
    socket.on("SERVER:JOIN_TO_ROOM", (dialogueId: string) => {
      socket.emit("CLIENT:JOIN_ROOM", dialogueId);
    });

    socket.on("SERVER:FRIEND_ONLINE", (friend_id: string) => {
      // console.log(`Friend with id: ${friend_id} ONLINE!`);

      dispatch(socketChangeFriendStatus({ id: friend_id, status: true }));
      dispatch(
        socketChangeDialogueFriendStatus({ id: friend_id, status: true })
      );
    });

    socket.on("SERVER:FRIEND_OFFLINE", (friend_id: string) => {
      // console.log(`Friend with id: ${friend_id} OFFLINE!`);

      dispatch(socketChangeFriendStatus({ id: friend_id, status: false }));
      dispatch(
        socketChangeDialogueFriendStatus({ id: friend_id, status: false })
      );
    });

    return () => {
      socket.off("SERVER:JOIN_TO_ROOM");
      socket.off("SERVER:FRIEND_ONLINE");
      socket.off("SERVER:FRIEND_OFFLINE");
    };
  }, []);

  return (
    <main className={styles["home"]}>
      <Sidebar />
      <div className={styles["home__content"]}>
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
