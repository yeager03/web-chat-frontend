import { FC, ReactElement } from "react";

// containers
import FriendsList from "../../containers/FriendsList";
import Requests from "../../containers/Requests";

// mui components
import { Typography, Box } from "@mui/material";

// icons
import { GroupRounded, PersonAddRounded } from "@mui/icons-material";

// style
import styles from "./Friends.module.scss";

type FriendsProps = {
	isModalOpen: boolean;
	showModal: () => void;
};

const Friends: FC<FriendsProps> = (props): ReactElement => {
	const { showModal, isModalOpen } = props;

	return (
		<>
			<Box className={styles["friends"]}>
				<Box className={styles["friends__header"]}>
					<Box className={styles["friends__header-title"]}>
						<GroupRounded sx={{ fontSize: 22 }} />
						<Typography variant="h2">Друзья</Typography>
					</Box>

					<button className={styles["friends__header-button"]} onClick={showModal} disabled={isModalOpen}>
						<PersonAddRounded sx={{ fontSize: 16, color: "#fff" }} />
					</button>
				</Box>

				<Box className={styles["friends__list"]}>
					<FriendsList />
				</Box>
			</Box>

			<Requests />
		</>
	);
};

export default Friends;
