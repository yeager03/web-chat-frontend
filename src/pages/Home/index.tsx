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
import { socket, connectSocket } from "../../core/socket";

// sounds
import NotificationSound from "../../assets/sounds/requests_sound.mp3";
import MessageSound from "../../assets/sounds/message_sound.mp3";

// selectors
import {
  changeDialogueMessage,
  dialogueSelector,
  setCurrentDialogue,
  setCurrentDialogueId,
} from "../../store/slices/dialogue/dialogueSlice";

// actions
import {
  getRequests,
  getFriends,
} from "../../store/slices/friend/friendActions";
import {
  socketAddRequest,
  socketAddFriend,
} from "../../store/slices/friend/friendSlice";
import { getDialogues } from "../../store/slices/dialogue/dialogueActions";
import {
  socketAddMessage,
  socketEditMessage,
  socketDeleteMessage,
  socketClearMessages,
  setTyping,
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
      console.log(dialogue);
      console.log("new dialogue created");
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
      (dialogueId: string, message: IMessage) => {
        if (dialogues.find((dl) => dl._id === dialogueId)) {
          console.log("dialogue message changed");
          if (!message) {
            console.log(message);
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
              lastMessageInfo = "Изображения";
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
          }
        }
      }
    );

    socket.on("SERVER:MESSAGE_CREATED", (message: IMessage) => {
      console.log(message);
      if (dialogues.find((dl) => dl._id === String(message.dialogue))) {
        if (currentDialogueId === String(message.dialogue)) {
          dispatch(setTyping(false));
          dispatch(
            socketAddMessage({
              ...message,
              message: message.message ? decryptionText(message.message) : "",
            })
          );
        } else {
          if (user && message.author._id !== user._id) {
            const audio = new Audio(MessageSound);
            audio.autoplay = true;
            audio.volume = 0.25;
            audio.play().catch((error) => console.log(error));
          }
        }
      }
    });

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

    socket.on("SERVER:MESSAGES_READ", (messagesId: string[]) => {
      console.log(messagesId);
    });

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

/* <Message
	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
	user={{}}
	date="Wed Feb 22 2023 02:51:08 GMT+0600 (Восточный Казахстан)"
	audio="https://notificationsounds.com/storage/sounds/file-oringz-beautiful-christmas-tune.mp3"
/>

<Message
	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
	user={{}}
	date="Wed Feb 22 2023 02:51:08 GMT+0600 (Восточный Казахстан)"
	audio="https://muzbear.net/files/track/2022/12/yavomag-rubikdice-chilx-tokyo-rain-phonk.mp3"
/> */

/* <Dialogues
				dialogues={[
					{
						user: {
							fullName: "Непобедимый Майки",
							avatar: null,
						},
						lastMessage: {
							text: "В наши дни никто не думает, что гопники — это круто, верно? Во времена моего старшего брата здесь было множество банд байкеров.",
							isRead: false,
							created_at: new Date(),
						},
					},
				]}
				/> */

/*<Message avatar="https://avatars.githubusercontent.com/u/76945338?v=4" user={{}} isTyping />

				<Message
					avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
					user={{}}
					text="Салам, как дела? Ну что там по проекту? Закончил?"
				/>

				<Message
					avatar="https://sun2.dataix-kz-akkol.userapi.com/s/v1/if1/iwEcBMWSaj-9Hsic3PRFGDI4Rq_TsLuI521iXxhJ1RKXJpIE_2_wfAhmvxlR4vuSK-4Yxrgs.jpg?size=200x200&quality=96&crop=155,96,769,769&ava=1"
					user={{}}
					attachments={[
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=1",
						},
					]}
				/>

				<Message
					avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
					text="Салам, как дела? Ну что там по проекту? Закончил?"
					date="Wed Feb 22 2023 02:51:08 GMT+0600 (Восточный Казахстан)"
					user={{}}
					attachments={[
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=1",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=2",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=3",
						},
					]}
				/>
				<Message
					avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
					text="Привет"
					date="Wed Feb 22 2023 02:21:08 GMT+0600 (Восточный Казахстан)"
					user={{}}
					attachments={[
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=1",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=2",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=3",
						},
					]}
				/>
				<Message
					avatar="https://sun2.dataix-kz-akkol.userapi.com/s/v1/if1/iwEcBMWSaj-9Hsic3PRFGDI4Rq_TsLuI521iXxhJ1RKXJpIE_2_wfAhmvxlR4vuSK-4Yxrgs.jpg?size=200x200&quality=96&crop=155,96,769,769&ava=1"
					text="Салам, пойдет, ты как? Хвала Аллаху! Почти закончил!"
					date="Wed Feb 22 2023 02:21:08 GMT+0600 (Восточный Казахстан)"
					user={{}}
					isMyMessage={true}
					isRead={false}
					attachments={[
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=1",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=2",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=3",
						},
					]}
				/>
				<Message
					avatar="https://sun2.dataix-kz-akkol.userapi.com/s/v1/if1/iwEcBMWSaj-9Hsic3PRFGDI4Rq_TsLuI521iXxhJ1RKXJpIE_2_wfAhmvxlR4vuSK-4Yxrgs.jpg?size=200x200&quality=96&crop=155,96,769,769&ava=1"
					text="Салам, ты как?"
					date="Wed Feb 22 2023 02:21:08 GMT+0600 (Восточный Казахстан)"
					user={{}}
					isMyMessage={true}
					attachments={[
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=1",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=2",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=3",
						},
					]}
				/>

				<Message
					avatar="https://sun2.dataix-kz-akkol.userapi.com/s/v1/if1/iwEcBMWSaj-9Hsic3PRFGDI4Rq_TsLuI521iXxhJ1RKXJpIE_2_wfAhmvxlR4vuSK-4Yxrgs.jpg?size=200x200&quality=96&crop=155,96,769,769&ava=1"
					text="Идейные соображения высшего порядка, а также дальнейшее развитие различных форм деятельности влечет за собой процесс внедрения и модернизации существенных финансовых и административных условий. Равным образом постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет выполнять важные задания по разработке существенных финансовых и административных условий."
					date="Wed Feb 22 2023 02:21:08 GMT+0600 (Восточный Казахстан)"
					user={{}}
					isMyMessage={true}
					attachments={[
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=1",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=2",
						},
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=3",
						},
					]}
				/>

				<Message
					avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
					user={{}}
					text="Салам, как дела? Ну что там по проекту? Закончил?"
					isMyMessage
				/>

				<Message avatar="https://avatars.githubusercontent.com/u/76945338?v=4" user={{}} isMyMessage isTyping />

				<Message
					avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
					user={{}}
					attachments={[
						{
							filename: "image",
							url: "https://source.unsplash.com/100x100/?random=1",
						},
					]}
					isMyMessage
				/> */
