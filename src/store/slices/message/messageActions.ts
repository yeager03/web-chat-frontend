import { createAsyncThunk } from "@reduxjs/toolkit";

// service
import MessageService from "../../../services/MessageService";

// utils
import getNotification from "../../../utils/notification";
import decryptionText from "../../../utils/decryptionText";

// types
import IMessage from "../../../models/IMessage";
import MessagesResponse, { MessageResponse } from "../../../models/response/MessageResponse";

type CreateMessage = {
	message: string;
	dialogueId: string;
};

export const getMessages = createAsyncThunk<IMessage[], string>("message/getMessages", async (currentDialogueId) => {
	const response = await MessageService.getMessages(currentDialogueId);
	const { messages }: MessagesResponse = response.data;
	return messages.map((item) => ({ ...item, message: decryptionText(item.message) }));
});

export const createMessage = createAsyncThunk<void, CreateMessage>(
	"message/createMessage",
	async ({ message, dialogueId }) => {
		await MessageService.createMessage(message, dialogueId);
	}
);

export const removeMessage = createAsyncThunk<string, string, { rejectValue: string }>(
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
