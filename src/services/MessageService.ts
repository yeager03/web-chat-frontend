import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import MessagesResponse, { MessageResponse } from "../models/response/MessageResponse";

export default class MessageService {
	public static async getMessages(currentDialogueId: string): Promise<AxiosResponse<MessagesResponse>> {
		return $api.get<MessagesResponse>(`/message/all/${currentDialogueId}`);
	}

	public static async createMessage(message: string, dialogueId: string): Promise<AxiosResponse<MessageResponse>> {
		return $api.post<MessageResponse>("/message/create", { message, dialogueId });
	}

	public static async removeMessage(messageId: string): Promise<AxiosResponse<MessageResponse>> {
		return $api.delete<MessageResponse>(`/message/${messageId}`);
	}
}
