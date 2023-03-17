import { FC, ReactElement, useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";

// socket
import socket from "../../../core/socket";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseDialogues from "../components/Dialogues";

// selectors
import { dialogueSelector } from "../../../store/slices/dialogue/dialogueSlice";

// actions
import { setCurrentDialogueId } from "../../../store/slices/dialogue/dialogueSlice";
import { getDialogues } from "../../../store/slices/dialogue/dialogueActions";
import { useParams } from "react-router-dom";

const Dialogues: FC = (): ReactElement => {
	const [searchValue, setSearchValue] = useState<string>("");
	const { dialogues, status, currentDialogueId } = useSelector(dialogueSelector);

	const dispatch = useAppDispatch();

	const { dialogueId } = useParams();

	useEffect(() => {
		dispatch(getDialogues());
	}, []);

	useEffect(() => {
		function socketDialogueListener() {
			dispatch(getDialogues());
		}

		if (dialogueId) {
			dispatch(setCurrentDialogueId(dialogueId));
		}

		socket.on("SERVER:DIALOGUE_CREATED", socketDialogueListener);

		return () => {
			socket.removeListener("SERVER:DIALOGUE_CREATED", socketDialogueListener);
		};
	}, [dialogueId]);

	const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value.toLowerCase());
	};

	const filteredDialogues = dialogues.filter(
		(dialogue) => dialogue.interlocutor.fullName.toLowerCase().indexOf(searchValue) > -1
	);

	return (
		<BaseDialogues
			dialogues={filteredDialogues}
			searchValue={searchValue}
			handleChangeValue={handleChangeValue}
			status={status}
			// dialogue
			currentDialogueId={currentDialogueId}
		/>
	);
};

export default Dialogues;
