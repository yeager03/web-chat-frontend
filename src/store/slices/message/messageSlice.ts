import { RootState } from "../../index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { Status } from "../../../models/Status";
import IMessage from "../../../models/IMessage";

// actions
import { getMessages, createMessage, deleteMessage, editMessage, EditMessage } from "./messageActions";

interface IMessageState {
	status: Status;
	isTyping: boolean;
	messages: IMessage[];
}

const initialState: IMessageState = {
	status: Status["IDLE"],
	isTyping: false,
	messages: [],
};

export const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {
		setTyping: (state, action: PayloadAction<boolean>) => {
			state.isTyping = action.payload;
		},
		socketClearMessages: (state) => {
			state.messages = [];
			state.status = Status["IDLE"];
		},
		socketAddMessage: (state, action: PayloadAction<IMessage>) => {
			state.messages.push(action.payload);
		},
		socketDeleteMessage: (state, action: PayloadAction<string>) => {
			state.messages = state.messages.filter((message) => message._id !== action.payload);
		},
		socketEditMessage: (state, action: PayloadAction<EditMessage>) => {
			state.messages = state.messages.map((message) => {
				if (message._id === action.payload.messageId) {
					message.message = action.payload.messageText;
					message.isEdited = true;
				}

				return message;
			});
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
			.addCase(deleteMessage.pending, () => {})
			.addCase(deleteMessage.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.messages = state.messages.filter((message) => message._id !== action.payload);
				}
			})
			.addCase(deleteMessage.rejected, (state) => {
				state.status = Status["ERROR"];
			})
			// edit message
			.addCase(editMessage.pending, () => {})
			.addCase(editMessage.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.messages = state.messages.map((message) => {
						if (message._id === action.payload.messageId) {
							message.message = action.payload.messageText;
							message.isEdited = true;
						}

						return message;
					});
				}
			})
			.addCase(editMessage.rejected, (state) => {
				state.status = Status["ERROR"];
			});
	},
});

export const messageSelector = (state: RootState) => state.message;
export const { setTyping, socketAddMessage, socketDeleteMessage, socketEditMessage, socketClearMessages } =
	messageSlice.actions;
export default messageSlice.reducer;
