import { createAsyncThunk } from "@reduxjs/toolkit";

// service
import MessageService, { CreateMessage } from "../../../services/MessageService";

// utils
import getNotification from "../../../utils/notification";
import decryptionText from "../../../utils/decryptionText";

// types
import IMessage from "../../../models/IMessage";
import MessagesResponse, { MessageResponse } from "../../../models/response/MessageResponse";

export type EditMessage = {
	messageId: string;
	messageText: string;
};

export const getMessages = createAsyncThunk<IMessage[], string>("message/getMessages", async (currentDialogueId) => {
	const response = await MessageService.getMessages(currentDialogueId);
	const { messages }: MessagesResponse = response.data;
	return messages.map((item) => ({ ...item, message: decryptionText(item.message) }));
});

export const createMessage = createAsyncThunk<void, CreateMessage>("message/createMessage", async (data) => {
	await MessageService.createMessage(data);
});

export const deleteMessage = createAsyncThunk<string, string, { rejectValue: string }>(
	"message/removeMessage",
	async (messageId, thunkApi) => {
		try {
			const response = await MessageService.removeMessage(messageId);
			const { status, message }: MessageResponse = response.data;

			if (status === "success") {
				getNotification(message, status);
			}

			return messageId;
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification(message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);

export const editMessage = createAsyncThunk<EditMessage, EditMessage, { rejectValue: string }>(
	"message/editMessage",
	async ({ messageId, messageText }, thunkApi) => {
		try {
			const response = await MessageService.editMessage(messageId, messageText);
			const { status, message }: MessageResponse = response.data;

			if (status === "success") {
				getNotification(message, status);
			}

			return { messageId, messageText };
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification(message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);
