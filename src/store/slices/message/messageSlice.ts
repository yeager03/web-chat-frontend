import { RootState } from "../../index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { Status } from "../../../models/Status";
import IMessage from "../../../models/IMessage";

// actions
import { getMessages, createMessage, removeMessage } from "./messageActions";

interface IMessageState {
	status: Status;
	messages: IMessage[];
}

const initialState: IMessageState = {
	status: Status["IDLE"],
	messages: [],
};

export const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {
		clearMessages: (state) => {
			state.messages = [];
			state.status = Status["IDLE"];
		},
		addMessage: (state, action: PayloadAction<IMessage>) => {
			state.messages.push(action.payload);
		},
		deleteMessage: (state, action: PayloadAction<string>) => {
			state.messages = state.messages.filter((message) => message._id !== action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			// get messages
			.addCase(getMessages.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(getMessages.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.messages = action.payload;
				}
			})
			.addCase(getMessages.rejected, (state) => {
				state.status = Status["ERROR"];
			})
			// create message
			.addCase(createMessage.pending, () => {})
			.addCase(createMessage.fulfilled, (state) => {
				state.status = Status["SUCCESS"];
			})
			.addCase(createMessage.rejected, (state) => {
				state.status = Status["ERROR"];
			})
			// remove message
			.addCase(removeMessage.pending, () => {})
			.addCase(removeMessage.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.messages = state.messages.filter((message) => message._id !== action.payload);
				}
			})
			.addCase(removeMessage.rejected, (state) => {
				state.status = Status["ERROR"];
			});
	},
});

export const messageSelector = (state: RootState) => state.message;
export const { addMessage, deleteMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
