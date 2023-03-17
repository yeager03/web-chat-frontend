export default interface IUser {
	_id: string;
	email: string;
	fullName: string;
	avatar: string | null;
	avatarColors: {
		color: string;
		lighten: string;
	};
	isActivated: boolean;
	lastVisit: string;
	isOnline: boolean;
}
