// types
import IUser from "./IUser";
import IMessage from "./IMessage";

export default interface IDialogue {
	_id: string;
	author: IUser;
	interlocutor: IUser;
	lastMessage: IMessage;
	createdAt: string;
	updatedAt: string;
}
