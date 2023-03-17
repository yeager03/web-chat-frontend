import { FC, Fragment, ReactElement, RefObject } from "react";

// containers
import Messages from "../../containers/Messages";
import ChatInput from "../../containers/ChatInput";

// classnames
import cn from "classnames";

// styles
import styles from "./Chat.module.scss";

// icons
import { EllipsisOutlined } from "@ant-design/icons";

// types
import { Status } from "../../../../models/Status";

// models
import IUser from "../../../../models/IUser";

type ChatProps = {
	interlocutor: IUser | null;
	status: Status;
	messagesRef: RefObject<HTMLDivElement>;
};

const Chat: FC<ChatProps> = (props): ReactElement => {
	const { interlocutor, status, messagesRef } = props;

	return (
		<div className={styles["chat"]}>
			<div className={styles["chat__header"]}>
				{interlocutor ? (
					<Fragment>
						<div className={styles["chat__header-empty"]}></div>
						<div className={styles["chat__header-info"]}>
							<b className={styles["chat__header-title"]}>{interlocutor.fullName}</b>
							<div
								className={cn(styles["chat__header-status"], {
									[styles["chat__header-status_online"]]: interlocutor.isOnline,
								})}
							>
								<span className={styles["status"]}>{interlocutor.isOnline ? "онлайн" : "офлайн"}</span>
							</div>
						</div>
						<EllipsisOutlined className={styles["icon"]} />
					</Fragment>
				) : null}
			</div>

			<div className={styles["chat__messages"]} ref={messagesRef}>
				<Messages />
			</div>

			{status !== "idle" && (
				<div className={styles["chat__input"]}>
					<ChatInput />
				</div>
			)}
		</div>
	);
};

export default Chat;
