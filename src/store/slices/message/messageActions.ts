import { createAsyncThunk } from "@reduxjs/toolkit";

// service
import MessageService from "../../../services/MessageService";

// utils
import getNotification from "../../../utils/notification";

// types
import IMessage from "../../../models/IMessage";
import IMessagesResponse, { IMessageResponse } from "../../../models/response/MessageResponse";

type CreateMessage = {
	message: string;
	dialogueId: string;
};

export const getMessages = createAsyncThunk<IMessage[], string>("message/getMessages", async (currentDialogueId) => {
	const response = await MessageService.getMessages(currentDialogueId);
	const { messages }: IMessagesResponse = response.data;

	return messages;
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
			const { status, message }: IMessageResponse = response.data;

			if (status === "success") {
				getNotification("Успех", message, status);
			}

			return messageId;
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification("Ошибка", message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);
