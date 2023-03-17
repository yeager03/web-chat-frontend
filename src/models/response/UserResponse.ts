// types
import IUser from "../IUser";

export default interface UserResponse {
	status: string;
	message: string;
	user: IUser;
}
