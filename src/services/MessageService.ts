import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import IMessagesResponse, { IMessageResponse } from "../models/response/MessageResponse";

export default class MessageService {
	public static async getMessages(currentDialogueId: string): Promise<AxiosResponse<IMessagesResponse>> {
		return $api.get<IMessagesResponse>(`/message/all/${currentDialogueId}`);
	}

	public static async createMessage(message: string, dialogueId: string): Promise<AxiosResponse<IMessageResponse>> {
		return $api.post<IMessageResponse>("/message/create", { message, dialogueId });
	}

	public static async removeMessage(messageId: string): Promise<AxiosResponse<IMessageResponse>> {
		return $api.delete<IMessageResponse>(`/message/${messageId}`);
	}
}
