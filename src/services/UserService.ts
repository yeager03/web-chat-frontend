import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import UserResponse from "../models/response/UserResponse";

export default class UserService {
	public static async findUserByEmail(email: string): Promise<AxiosResponse<UserResponse>> {
		return $api.get(`/user/find?email=${email}`);
	}
}
