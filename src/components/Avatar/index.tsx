import { FC, ReactElement } from "react";

// style
import styles from "./Avatar.module.scss";

// random color
import getRandomColor from "../../utils/helpers/getRandomColor";

type AvatarProps = {
	user: any; // any ?
};

const Avatar: FC<AvatarProps> = (props): ReactElement => {
	const { user } = props;
	const { color, lighten } = getRandomColor();

	if (user["avatar"]) {
		return <img src={user["avatar"]} alt={`Avatar ${user["fullName"]} img`} className={styles["avatar__image"]} />;
	}

	return (
		<span
			className={styles["avatar__empty"]}
			style={{
				background: `linear-gradient(135deg, ${color} 0%, ${lighten} 96.52%)`,
			}}
		>
			{user["fullName"].charAt(0)}
		</span>
	);
};

export default Avatar;
