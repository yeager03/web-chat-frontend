import { IFile } from "./IMessage";

export default interface IUser {
	_id: string;
	email: string;
	fullName: string;
	avatar: IFile | null;
	avatarColors: {
		color: string;
		lighten: string;
	};
	lastVisit: string;
	isOnline: boolean;
}
