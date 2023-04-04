import { FC, ReactElement, useState, MouseEvent } from "react";

// components
import UserAvatar from "../../../../components/UserAvatar";

// mui components
import { Box, Typography, Popover } from "@mui/material";

// mui icons
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

// classnames
import cn from "classnames";

// style
import styles from "./FriendItem.module.scss";

// types
import IUser from "../../../../models/IUser";

type FriendItemProps = IUser & {
	showModal: (e: MouseEvent<HTMLSpanElement>, id: string) => void;
	handleDeleteFriend: (e: MouseEvent<HTMLParagraphElement>, id: string) => void;
};

const FriendItem: FC<FriendItemProps> = (props): ReactElement => {
	const { _id, fullName, isOnline, showModal, handleDeleteFriend } = props;
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handlePopoverOpen = (event: MouseEvent<HTMLSpanElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<li
			className={cn(styles["friend__item"], {
				[styles["friend__item_online"]]: isOnline,
			})}
		>
			<Box className={styles["friend__item-avatar"]}>
				<UserAvatar user={props} />
			</Box>
			<Box className={styles["friend__item-content"]}>
				<Box className={styles["friend__item-info"]}>
					<Typography variant="h3" className={styles["friend__item-title"]}>
						{fullName}
					</Typography>
					<Typography
						className={styles["friend__item-subtitle"]}
						component={"span"}
						onClick={(e) => showModal(e, _id)}
					>
						Написать сообщение
					</Typography>
				</Box>

				<Typography component={"span"} className={styles["friend__item-button"]} onClick={handlePopoverOpen}>
					<MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
				</Typography>

				<Popover
					id="mouse-over-popover"
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					onClose={handlePopoverClose}
				>
					<Typography
						className={styles["friend__item-popover"]}
						onClick={(e) => handleDeleteFriend(e, _id)}
						component={"p"}
					>
						Удалить из друзей
					</Typography>
				</Popover>
			</Box>
		</li>
	);
};

export default FriendItem;
