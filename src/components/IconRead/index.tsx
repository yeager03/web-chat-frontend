import { FC, ReactElement, Fragment } from "react";

// image
import CheckedIcon from "../../assets/images/checkboxes-read.svg";
import NotCheckedIcon from "../../assets/images/checkboxes-not-read.svg";

type MessageProps = {
	className: string;
	isMyMessage?: boolean; // del ?
	isTyping?: boolean; // del ?
	isRead?: boolean;
};
// styles["message__checked-icon"];

const IconRead: FC<MessageProps> = (props): ReactElement => {
	const { className, isMyMessage, isTyping, isRead } = props;

	return (
		<Fragment>
			{isMyMessage && !isTyping && (
				<span className={className}>
					{isRead ? (
						<img src={CheckedIcon} alt="Message checked icon" />
					) : (
						<img src={NotCheckedIcon} alt="Message not checked icon" />
					)}
				</span>
			)}
		</Fragment>
	);
};

export default IconRead;
