import { FC, ReactElement, MouseEvent } from "react";

// components
import UserAvatar from "../../../../components/UserAvatar";
import Button from "../../../../components/Button";

// mui components
import { Box, Typography } from "@mui/material";

// classnames
import cn from "classnames";

// style
import styles from "./RequestItem.module.scss";

// types
import IUser from "../../../../models/IUser";

type RequestItemProps = IUser & {
	acceptRequestFriend: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
	denyRequestFriend: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
};

const RequestItem: FC<RequestItemProps> = (props): ReactElement => {
	const { _id, fullName, isOnline, acceptRequestFriend, denyRequestFriend } = props;

	return (
		<li
			className={cn(styles["request__item"], {
				[styles["request__item_online"]]: isOnline,
			})}
		>
			<Box className={styles["request__item-info"]}>
				<Box className={styles["request__item-avatar"]}>
					<UserAvatar user={props} />
				</Box>
				<Typography variant="h3" className={styles["request__item-title"]}>
					{fullName}
				</Typography>
			</Box>

			<Box className={styles["request__item-actions"]}>
				<Button className={cn(styles["button"])} onClick={(e) => acceptRequestFriend(e, _id)}>
					Принять заявку
				</Button>
				<Button className={cn(styles["button"], styles["button_deny"])} onClick={(e) => denyRequestFriend(e, _id)}>
					Удалить подписчика
				</Button>
			</Box>
		</li>
	);
};

export default RequestItem;
