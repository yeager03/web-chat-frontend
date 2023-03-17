// types
import IDialogue from "./IDialogue";
import IUser from "./IUser";

export default interface IMessage {
	_id: string;
	author: IUser;
	message: string;
	dialogue: IDialogue;
	unRead: boolean;
	createdAt: string;
	updatedAt: string;
}
