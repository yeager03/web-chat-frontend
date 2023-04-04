import { FC, ReactElement, MouseEvent } from "react";

// classnames
import cn from "classnames";

// mui components
import { CircularProgress, Typography } from "@mui/material";

// components
import Request from "../RequestItem";

// styles
import styles from "./RequestsList.module.scss";

// types
import { Status } from "../../../../models/Status";
import IUser from "../../../../models/IUser";

type RequestsListProps = {
	status: Status;
	requests: IUser[];

	acceptRequestFriend: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
	denyRequestFriend: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
};

const RequestsList: FC<RequestsListProps> = (props): ReactElement => {
	const { status, requests, acceptRequestFriend, denyRequestFriend } = props;

	const loading = status === "loading" ? <CircularProgress /> : null;
	const empty =
		status === "success" && !requests.length ? (
			<Typography variant="h3">У вас пока нет заявок в друзья 😔</Typography>
		) : null;
	const sortedFriends =
		status === "success" && requests.length
			? requests.map((request) => (
					<Request
						key={request["_id"]}
						{...request}
						acceptRequestFriend={acceptRequestFriend}
						denyRequestFriend={denyRequestFriend}
					/>
			  ))
			: null;

	return (
		<ul
			className={cn(styles["requests__items"], {
				[styles["requests__items_empty"]]: !requests.length,
			})}
		>
			{loading}
			{empty}
			{sortedFriends}
		</ul>
	);
};

export default RequestsList;
