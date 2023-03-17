import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import DialogueResponse from "../models/response/DialogueResponse";

export default class DialogueService {
	public static async getDialogues(): Promise<AxiosResponse<DialogueResponse>> {
		return $api.get<DialogueResponse>("/dialogue/all");
	}

	public static async createDialogue(
		interlocutor: string,
		lastMessage: string
	): Promise<AxiosResponse<DialogueResponse>> {
		return $api.post<DialogueResponse>("/dialogue/create", { interlocutor, lastMessage });
	}
}
