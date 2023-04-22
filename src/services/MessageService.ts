import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import MessagesResponse, { MessageResponse } from "../models/response/MessageResponse";

export default class MessageService {
	public static async getMessages(currentDialogueId: string): Promise<AxiosResponse<MessagesResponse>> {
		return $api.get<MessagesResponse>(`/message/all/${currentDialogueId}`);
	}

	public static async createMessage(data: FormData): Promise<AxiosResponse<MessageResponse>> {
		return $api.post<MessageResponse>("/message/create", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	public static async removeMessage(messageId: string): Promise<AxiosResponse<MessageResponse>> {
		return $api.delete<MessageResponse>(`/message/remove/${messageId}`);
	}

	public static async editMessage(messageId: string, messageText: string): Promise<AxiosResponse<MessageResponse>> {
		return $api.put<MessageResponse>(`/message/edit/${messageId}`, {
			message: messageText,
		});
	}
}
