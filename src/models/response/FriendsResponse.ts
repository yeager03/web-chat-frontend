// types
import IUser from "../IUser";

export default interface FriendsResponse {
	status: string;
	friends: IUser[];
}
