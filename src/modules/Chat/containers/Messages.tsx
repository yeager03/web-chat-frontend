import { FC, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseMessages from "../components/Messages";

// selectors
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";
import { messageSelector } from "../../../store/slices/message/messageSlice";

// actins
import { getMessages } from "../../../store/slices/message/messageActions";

const Messages: FC = (): ReactElement => {
	const { currentDialogueId } = useSelector(dialogueSelector);
	const { messages, status } = useSelector(messageSelector);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (currentDialogueId) {
			dispatch(getMessages(currentDialogueId));
		}
	}, [currentDialogueId]);

	return <BaseMessages messages={messages} status={status} />;
};

export default Messages;
