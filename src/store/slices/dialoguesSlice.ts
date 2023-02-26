import { RootState } from "./../index";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// axios
import dialogues from "../../utils/api/dialogues";

type User = {
	_id: string;
	fullName: string;
	avatar: null | string;
};

export type Dialogue = {
	_id: string;
	lastMessage: string;
	created_at: string;
	user: User;
};

export enum Status {
	IDLE = "idle",
	LOADING = "loading",
	SUCCESS = "success",
	ERROR = "error",
}

interface IDialoguesState {
	status: Status;
	dialogues: Dialogue[];
	currentDialogueID: string;
}

const initialState: IDialoguesState = {
	status: Status["IDLE"],
	dialogues: [],
	currentDialogueID: "",
};

export const getDialogues = createAsyncThunk<Dialogue[]>("dialogues/getDialogues", async () => {
	const { data } = await dialogues.getAll();
	return data;
});

export const dialoguesSlice = createSlice({
	name: "dialogues",
	initialState,
	reducers: {
		setCurrentDialogue: (state, action: PayloadAction<string>) => {
			state.currentDialogueID = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDialogues.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(getDialogues.fulfilled, (state, action) => {
				state.status = Status["SUCCESS"];
				state.dialogues = action.payload;
			})
			.addCase(getDialogues.rejected, (state) => {
				state.status = Status["ERROR"];
			});
	},
});

export const dialoguesSelector = (state: RootState) => state.dialogues;
export const { setCurrentDialogue } = dialoguesSlice.actions;
export default dialoguesSlice.reducer;
