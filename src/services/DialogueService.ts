import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import DialogueResponse, { DialoguesResponse } from "../models/response/DialogueResponse";

export default class DialogueService {
	public static async getDialogues(): Promise<AxiosResponse<DialoguesResponse>> {
		return $api.get<DialoguesResponse>("/dialogue/all");
	}

	public static async createDialogue(
		interlocutorId: string,
		lastMessage: string
	): Promise<AxiosResponse<DialogueResponse>> {
		return $api.post<DialogueResponse>("/dialogue/create", { interlocutorId, lastMessage });
	}
}
