import { FC, ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseMessages from "../components/Messages";

// selectors
import { dialoguesSelector } from "../../../store/slices/dialoguesSlice";

// actins
import { getMessages, messagesSelector } from "../../../store/slices/messagesSlice";

const Messages: FC = (): ReactElement => {
	const { currentDialogueID } = useSelector(dialoguesSelector);
	const { messages, status } = useSelector(messagesSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (currentDialogueID) {
			dispatch(getMessages(currentDialogueID));
		}
	}, [currentDialogueID]);

	return <BaseMessages messages={messages} status={status} />;
};

export default Messages;
