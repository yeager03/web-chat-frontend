// axios
import axios from "../../core/axios";

// types
import { Message } from "../../store/slices/messagesSlice";

export default {
	getMessageByDialogueId: (id: string) => axios.get<Message[]>(`/messages?dialogue=${id}`),
};
