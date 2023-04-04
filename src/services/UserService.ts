import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import UserResponse from "../models/response/UserResponse";
import FriendsResponse from "../models/response/FriendsResponse";
import RequestsResponse from "../models/response/RequestsResponse";

export default class UserService {
	public static async findUserByEmail(email: string): Promise<AxiosResponse<UserResponse>> {
		return $api.get(`/user/find/${email}`);
	}

	public static async getFriends(): Promise<AxiosResponse<FriendsResponse>> {
		return $api.get("/user/friends");
	}

	public static async getRequests(): Promise<AxiosResponse<RequestsResponse>> {
		return $api.get("/user/requests");
	}

	public static async friendRequest(recipientId: string): Promise<AxiosResponse<UserResponse>> {
		return $api.get(`/user/friend/request/${recipientId}`);
	}

	public static async acceptRequest(senderId: string): Promise<AxiosResponse<UserResponse>> {
		return $api.get(`/user/friend/accept/${senderId}`);
	}

	public static async denyRequest(senderId: string): Promise<AxiosResponse<UserResponse>> {
		return $api.get(`/user/friend/deny/${senderId}`);
	}

	public static async removeFriend(friendId: string): Promise<AxiosResponse<UserResponse>> {
		return $api.delete(`/user/friend/remove/${friendId}`);
	}
}
