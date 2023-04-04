export default interface IUser {
	_id: string;
	email: string;
	fullName: string;
	avatar: string | null;
	avatarColors: {
		color: string;
		lighten: string;
	};
	lastVisit: string;
	isOnline: boolean;
}
