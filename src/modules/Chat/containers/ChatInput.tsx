import { FC, ReactElement, ChangeEvent, useState } from "react";

// components
import BaseChatInput from "../components/ChatInput";

export type Emoji = {
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
};

const ChatInput: FC = (): ReactElement => {
	const [messageValue, setMessageValue] = useState<string>("");
	const [showEmojis, setShowEmojis] = useState<boolean>(false);

	const handleChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
		setMessageValue(e.target.value);
	};

	const handleClickShowEmojis = () => {
		setShowEmojis(!showEmojis);
	};

	const handleClickEmoji = (emoji: Emoji) => {
		setMessageValue((messageValue) => messageValue + emoji.native);
		setShowEmojis(false);
	};

	return (
		<BaseChatInput
			messageValue={messageValue}
			showEmojis={showEmojis}
			handleChangeSearchValue={handleChangeSearchValue}
			handleClickShowEmojis={handleClickShowEmojis}
			handleClickEmoji={handleClickEmoji}
		/>
	);
};

export default ChatInput;
