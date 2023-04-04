import { FC, ReactElement } from "react";

// style
import styles from "./UserAvatar.module.scss";

// types
import IUser from "../../models/IUser";

type UserAvatarProps = {
	user: IUser;
};

const UserAvatar: FC<UserAvatarProps> = (props): ReactElement => {
	const { user } = props;

	if (user["avatar"]) {
		return <img src={user["avatar"]} alt={`Avatar ${user["fullName"]} img`} className={styles["avatar__image"]} />;
	}

	return (
		<span
			className={styles["avatar__empty"]}
			style={{
				background: `linear-gradient(135deg, ${user["avatarColors"]["color"]} 0%, ${user["avatarColors"]["lighten"]} 96.52%)`,
			}}
		>
			{user["fullName"].charAt(0)}
		</span>
	);
};

export default UserAvatar;
