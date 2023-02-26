import { FC, ReactElement } from "react";

// containers
import Sidebar from "../../modules/SideBar";
import Chat from "../../modules/Chat";

// style
import styles from "./Home.module.scss";

const Home: FC = (): ReactElement => {
	return (
		<section className={styles["home"]}>
			<Sidebar />
			<Chat />
		</section>
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
