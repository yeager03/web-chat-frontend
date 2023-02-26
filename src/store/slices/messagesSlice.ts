import { RootState } from "./../index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// axios
import messages from "../../utils/api/messages";

type User = {
	_id: string;
	fullName: string;
	avatar: null | string;
};

export type Message = {
	_id: string;
	text: string;
	created_at: string;
	user: User;
	dialogue: string;
};

export enum Status {
	IDLE = "idle",
	LOADING = "loading",
	SUCCESS = "success",
	ERROR = "error",
}

interface IMessagesState {
	status: Status;
	messages: Message[];
}

const initialState: IMessagesState = {
	status: Status["IDLE"],
	messages: [],
};

export const getMessages = createAsyncThunk<Message[], string>("messages/getMessages", async (id) => {
	const { data } = await messages.getMessageByDialogueId(id);
	return data;
});

export const messagesSlice = createSlice({
	name: "messages",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getMessages.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(getMessages.fulfilled, (state, action) => {
				state.status = Status["SUCCESS"];
				state.messages = action.payload;
			})
			.addCase(getMessages.rejected, (state) => {
				state.status = Status["ERROR"];
			});
	},
});

export const messagesSelector = (state: RootState) => state.messages;
export default messagesSlice.reducer;
