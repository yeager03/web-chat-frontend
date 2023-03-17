// types
import IMessage from "../IMessage";

export default interface IMessagesResponse {
	status: string;
	messages: IMessage[];
}

export interface IMessageResponse {
	status: string;
	message: string;
}
