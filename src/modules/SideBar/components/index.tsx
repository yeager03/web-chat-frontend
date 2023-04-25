import { FC, ReactElement } from "react";
import { Link, useMatch } from "react-router-dom";

// classnames
import cn from "classnames";

// mui components
import { SvgIcon, Box, Typography } from "@mui/material";

// icons
import { LogoutRounded, GroupRounded, SvgIconComponent, QuestionAnswerRounded, CallRounded } from "@mui/icons-material";

// style
import styles from "./SideBar.module.scss";

// components
import UserAvatar from "../../../components/UserAvatar";

// types
import IUser from "../../../models/IUser";

type ListItemProps = {
	to: string;
	icon: SvgIconComponent;
	length?: number;
	handleChangeLink: () => void;
};

const ListItem: FC<ListItemProps> = (props): ReactElement => {
	const { to, icon, length, handleChangeLink } = props;

	const match = useMatch({
		path: to,
		end: to.length === 1,
	});

	return (
		<li
			className={cn(styles["sidebar__top-item"], {
				[styles["sidebar__top-item_active"]]: match,
			})}
		>
			<Link to={to} replace onClick={handleChangeLink}>
				<SvgIcon component={icon} sx={{ fontSize: 24 }} />
			</Link>
			{length && length > 0 ? (
				<Typography component={"span"} className={styles["sidebar__top-item-count"]}>
					{length > 10 ? "10+" : length}
				</Typography>
			) : null}
		</li>
	);
};

type SideBarProps = {
	user: IUser | null;
	requestsLength: number;
	logout: () => void;
	handleChangeLink: () => void;
};

const SideBar: FC<SideBarProps> = (props): ReactElement => {
	const { user, requestsLength, logout, handleChangeLink } = props;

	return (
		<>
			{user && (
				<aside className={styles["sidebar"]}>
					<Box className={styles["sidebar__top"]}>
						<Link className={styles["sidebar__top-avatar"]} to={"/profile"}>
							{<UserAvatar user={user} />}
						</Link>

						<ul className={styles["sidebar__top-list"]}>
							<ListItem to={"/dialogues"} icon={QuestionAnswerRounded} handleChangeLink={handleChangeLink} />
							<ListItem to={"/calls"} icon={CallRounded} handleChangeLink={handleChangeLink} />
							<ListItem
								to={"/friends"}
								icon={GroupRounded}
								length={requestsLength}
								handleChangeLink={handleChangeLink}
							/>
						</ul>
					</Box>

					<button className={styles["sidebar__logout"]} onClick={logout}>
						<LogoutRounded sx={{ color: "#fff", fontSize: 24 }} />
					</button>
				</aside>
			)}
		</>
	);
};

export default SideBar;
