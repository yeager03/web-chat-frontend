import { RootState } from "../../index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { Status } from "../../../models/Status";
import IDialogue from "../../../models/IDialogue";

// actions
import { getDialogues } from "./dialogueActions";

interface IDialogueState {
	status: Status;
	dialogues: IDialogue[];
	currentDialogueId: string;
	currentDialogue: IDialogue | null;
}

const initialState: IDialogueState = {
	status: Status["IDLE"],
	dialogues: [],
	currentDialogueId: "",
	currentDialogue: null,
};

export const dialogueSlice = createSlice({
	name: "dialogue",
	initialState,
	reducers: {
		setCurrentDialogueId: (state, action: PayloadAction<string>) => {
			state.currentDialogueId = action.payload;
		},
		setCurrentDialogue: (state, action: PayloadAction<IDialogue>) => {
			state.currentDialogue = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDialogues.pending, (state) => {
				state.status = Status["LOADING"]; // ?
			})
			.addCase(getDialogues.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.dialogues = action.payload;
				}
			})
			.addCase(getDialogues.rejected, (state) => {
				state.status = Status["ERROR"];
			});
	},
});

export const dialogueSelector = (state: RootState) => state.dialogue;
export const { setCurrentDialogueId, setCurrentDialogue } = dialogueSlice.actions;
export default dialogueSlice.reducer;
