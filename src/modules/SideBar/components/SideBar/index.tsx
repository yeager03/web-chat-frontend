import { FC, ReactElement, ChangeEvent } from "react";

// containers
import Dialogues from "../../containers/Dialogues";

// icons
import { TeamOutlined, FormOutlined } from "@ant-design/icons";

// style
import styles from "./SideBar.module.scss";
import DialogueModal from "../DialogueModal";

type SideBarProps = {
	isModalOpen: boolean;
	isLoading: boolean;
	emailValue: string;
	messageValue: string;
	showModal: () => void;
	handleOk: () => void;
	handleCancel: () => void;
	handleChangeValue: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const SideBar: FC<SideBarProps> = (props): ReactElement => {
	const { isModalOpen, isLoading, emailValue, messageValue, showModal, handleOk, handleCancel, handleChangeValue } =
		props;

	return (
		<div className={styles["sidebar"]}>
			<div className={styles["sidebar__header"]}>
				<div className={styles["sidebar__header-list"]}>
					<TeamOutlined className={styles["icon"]} />
					<span>Список диалогов</span>
				</div>

				<FormOutlined className={styles["icon"]} onClick={showModal} />
			</div>

			<div className={styles["sidebar__dialogues"]}>
				<Dialogues />
			</div>

			<DialogueModal
				isModalOpen={isModalOpen}
				isLoading={isLoading}
				emailValue={emailValue}
				messageValue={messageValue}
				handleOk={handleOk}
				handleCancel={handleCancel}
				handleChangeValue={handleChangeValue}
			/>
		</div>
	);
};

export default SideBar;
