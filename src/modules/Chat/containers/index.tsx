import { FC, ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// components
import BaseChat from "../components/Chat";

// selector
import { messagesSelector } from "../../../store/slices/messagesSlice";

const Chat: FC = (): ReactElement => {
	const { status, messages } = useSelector(messagesSelector);
	const online = false;

	const messagesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = messagesRef.current;

		if (element) {
			element.scrollTo(0, element.scrollHeight);
		}
	}, [messages]);

	return <BaseChat online={online} status={status} messagesRef={messagesRef} />;
};

export default Chat;
