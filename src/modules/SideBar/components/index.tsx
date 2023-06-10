import { FC, ReactElement } from "react";
import { Link, useMatch } from "react-router-dom";

// classnames
import cn from "classnames";

// mui components
import { SvgIcon, Box, Typography } from "@mui/material";

// icons
import {
  LogoutRounded,
  GroupRounded,
  SvgIconComponent,
  QuestionAnswerRounded,
} from "@mui/icons-material";

// style
import styles from "./SideBar.module.scss";

// components
import UserAvatar from "../../../components/UserAvatar";

// types
import IUser from "../../../models/IUser";

type ListItemProps = {
  to: string;
  icon: SvgIconComponent;
  count?: number;
  handleChangeLink: () => void;
};

const ListItem: FC<ListItemProps> = (props): ReactElement => {
  const { to, icon, count, handleChangeLink } = props;

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
      {count && count > 0 ? (
        <Typography
          component={"span"}
          className={styles["sidebar__top-item-count"]}
        >
          {count > 10 ? "10+" : count}
        </Typography>
      ) : null}
    </li>
  );
};

type SideBarProps = {
  user: IUser | null;
  requestsCount: number;
  unreadMessagesCount: number;
  logout: () => void;
  handleChangeLink: () => void;
};

const SideBar: FC<SideBarProps> = (props): ReactElement => {
  const { user, requestsCount, unreadMessagesCount, logout, handleChangeLink } =
    props;

  return (
    <>
      {user && (
        <aside className={styles["sidebar"]}>
          <Box className={styles["sidebar__top"]}>
            <Link
              className={styles["sidebar__top-avatar"]}
              to={"/profile"}
              onClick={handleChangeLink}
            >
              {<UserAvatar user={user} />}
            </Link>

            <ul className={styles["sidebar__top-list"]}>
              <ListItem
                to={"/dialogues"}
                icon={QuestionAnswerRounded}
                count={unreadMessagesCount}
                handleChangeLink={handleChangeLink}
              />
              <ListItem
                to={"/friends"}
                icon={GroupRounded}
                count={requestsCount}
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
