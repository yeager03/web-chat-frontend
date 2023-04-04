import { FC, ReactElement, MouseEvent } from "react";

// classnames
import cn from "classnames";

// lodash
import orderBy from "lodash/orderBy";

// mui components
import { CircularProgress, Typography } from "@mui/material";

// components
import Friend from "../FriendItem";

// styles
import styles from "./FriendsList.module.scss";

// types
import { Status } from "../../../../models/Status";
import IUser from "../../../../models/IUser";

type FriendsListProps = {
	status: Status;
	friends: IUser[];
	// modal
	showModal: (e: MouseEvent<HTMLSpanElement>, id: string) => void;
	// delete friend
	handleDeleteFriend: (e: MouseEvent<HTMLParagraphElement>, id: string) => void;
};

const FriendsList: FC<FriendsListProps> = (props): ReactElement => {
	const { status, friends, showModal, handleDeleteFriend } = props;

	const loading = status === "loading" ? <CircularProgress /> : null;
	const empty =
		status === "success" && !friends.length ? <Typography variant="h3">У вас пока нет друзей 😔</Typography> : null;
	const sortedFriends =
		status === "success" && friends.length
			? orderBy(friends, ["fullName"], ["asc"]).map((friend) => (
					<Friend key={friend["_id"]} {...friend} showModal={showModal} handleDeleteFriend={handleDeleteFriend} />
			  ))
			: null;

	return (
		<ul
			className={cn(styles["friends__items"], {
				[styles["friends__items_empty"]]: !friends.length,
			})}
		>
			{loading}
			{empty}
			{sortedFriends}
		</ul>
	);
};

export default FriendsList;
