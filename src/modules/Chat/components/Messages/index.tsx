import { FC, ReactElement, Fragment } from "react";

// classnames
import cn from "classnames";

// styles
import styles from "./Messages.module.scss";

// antd components
import { Empty, Spin } from "antd";

// icons
import { LoadingOutlined } from "@ant-design/icons";

// components
import Message from "../Message";

// types
import { Message as MessageItem, Status } from "../../../../store/slices/messagesSlice";

type MessagesProps = {
	messages: MessageItem[];
	status: Status;
};

const Messages: FC<MessagesProps> = (props): ReactElement => {
	const { messages, status } = props;

	return (
		<Fragment>
			{status === "idle" ? (
				<Empty className={styles["icon"]} description="Выберите диалог" />
			) : status === "loading" ? (
				<Spin
					tip="Загрузка сообщений.."
					size="large"
					className={cn(styles["icon"], styles["icon__loading"])}
					indicator={<LoadingOutlined />}
				/>
			) : status === "success" && !messages.length ? (
				<Empty className={styles["icon"]} description="Сообщений пока нет" />
			) : status === "success" && messages.length ? (
				messages.map((message) => <Message key={message["_id"]} {...message} />)
			) : null}
		</Fragment>
	);
};

export default Messages;

// <Message
// 	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
// 	user={{}}
// 	text="Салам, как дела? Ну что там по проекту? Закончил?"
// />
// <Message
// 	avatar="https://sun2.dataix-kz-akkol.userapi.com/s/v1/if1/iwEcBMWSaj-9Hsic3PRFGDI4Rq_TsLuI521iXxhJ1RKXJpIE_2_wfAhmvxlR4vuSK-4Yxrgs.jpg?size=200x200&quality=96&crop=155,96,769,769&ava=1"
// 	user={{}}
// 	attachments={[
// 		{
// 			filename: "image",
// 			url: "https://source.unsplash.com/100x100/?random=1",
// 		},
// 	]}
// />
// <Message
// 	avatar="https://sun2.dataix-kz-akkol.userapi.com/s/v1/if1/iwEcBMWSaj-9Hsic3PRFGDI4Rq_TsLuI521iXxhJ1RKXJpIE_2_wfAhmvxlR4vuSK-4Yxrgs.jpg?size=200x200&quality=96&crop=155,96,769,769&ava=1"
// 	text="Идейные соображения высшего порядка, а также дальнейшее развитие различных форм деятельности влечет за собой процесс внедрения и модернизации существенных финансовых и административных условий. Равным образом постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет выполнять важные задания по разработке существенных финансовых и административных условий."
// 	date="Wed Feb 22 2023 02:21:08 GMT+0600 (Восточный Казахстан)"
// 	user={{}}
// 	isMyMessage={true}
// 	attachments={[
// 		{
// 			filename: "image",
// 			url: "https://source.unsplash.com/100x100/?random=1",
// 		},
// 		{
// 			filename: "image",
// 			url: "https://source.unsplash.com/100x100/?random=2",
// 		},
// 		{
// 			filename: "image",
// 			url: "https://source.unsplash.com/100x100/?random=3",
// 		},
// 	]}
// />
// <Message
// 	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
// 	user={{}}
// 	text="Салам, как дела? Ну что там по проекту? Закончил?"
// 	isMyMessage
// />
// <Message
// 	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
// 	user={{}}
// 	text="Салам, как дела? Ну что там по проекту? Закончил?"
// 	isMyMessage
// />
// <Message
// 	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
// 	user={{}}
// 	date="Wed Feb 22 2023 02:51:08 GMT+0600 (Восточный Казахстан)"
// 	audio="https://notificationsounds.com/storage/sounds/file-oringz-beautiful-christmas-tune.mp3"
// />
// <Message
// 	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
// 	user={{}}
// 	text="Салам, как дела? Ну что там по проекту? Закончил?"
// 	isMyMessage
// />
// <Message
// 	avatar="https://avatars.githubusercontent.com/u/76945338?v=4"
// 	user={{}}
// 	text="Салам, как дела? Ну что там по проекту? Закончил?"
// 	isMyMessage
// />
