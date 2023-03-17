// types
import IUser from "../IUser";

export default interface AuthResponse {
	status: string;
	message: string;
	accessToken: string;
	refreshToken: string;
	user: IUser;
}
