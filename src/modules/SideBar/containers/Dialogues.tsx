import { FC, ReactElement, useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";

// dispatch
import { useAppDispatch } from "../../../store";

// components
import BaseDialogues from "../components/Dialogues";

// selectors
import { dialoguesSelector } from "../../../store/slices/dialoguesSlice";

// actions
import { getDialogues, setCurrentDialogue } from "../../../store/slices/dialoguesSlice";

const Dialogues: FC = (): ReactElement => {
	const [searchValue, setSearchValue] = useState<string>("");

	const { dialogues, status, currentDialogueID } = useSelector(dialoguesSelector);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getDialogues());
	}, []);

	// function handles
	const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleClickDialogue = (id: string) => {
		dispatch(setCurrentDialogue(id));
	};

	// filtered dialogues
	const filteredDialogues = dialogues.filter(
		(dialogue) => dialogue.user.fullName.toLowerCase().indexOf(searchValue) > -1
	);

	return (
		<BaseDialogues
			dialogues={filteredDialogues}
			searchValue={searchValue}
			handleChangeValue={handleChangeValue}
			status={status}
			// dialogue
			currentDialogueID={currentDialogueID}
			handleClickDialogue={handleClickDialogue}
		/>
	);
};

export default Dialogues;
