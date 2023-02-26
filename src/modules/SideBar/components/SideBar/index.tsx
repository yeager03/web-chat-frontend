import { FC, ReactElement, ChangeEvent } from "react";

// containers
import Dialogues from "../../containers/Dialogues";

// icons
import { TeamOutlined, FormOutlined } from "@ant-design/icons";

// style
import styles from "./SideBar.module.scss";

const SideBar: FC = (): ReactElement => {
	return (
		<div className={styles["sidebar"]}>
			<div className={styles["sidebar__header"]}>
				<div className={styles["sidebar__header-list"]}>
					<TeamOutlined className={styles["icon"]} />
					<span>Список диалогов</span>
				</div>

				<FormOutlined className={styles["icon"]} />
			</div>

			<div className={styles["sidebar__dialogues"]}>
				<Dialogues />
			</div>
		</div>
	);
};

export default SideBar;
