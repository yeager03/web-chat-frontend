// types
import IMessage from "../IMessage";

export default interface MessagesResponse {
	status: string;
	messages: IMessage[];
}

export interface MessageResponse {
	status: string;
	message: string;
}
