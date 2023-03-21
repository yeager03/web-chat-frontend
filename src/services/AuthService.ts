import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import AuthResponse from "../models/response/AuthResponse";

interface ActivateResponse {
	status: string;
	message: string;
	email?: string;
}

export default class AuthService {
	public static async signIn(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/signin", { email, password });
	}

	public static async signUp(email: string, fullName: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/signup", { email, fullName, password });
	}

	public static async logout(): Promise<AxiosResponse<void>> {
		return $api.post("/user/logout");
	}

	public static async activateAccount(activationId: string): Promise<AxiosResponse<ActivateResponse>> {
		return $api.get(`/user/activate/${activationId}`);
	}

	public static async againSendActivateMail(email: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.get(`/user/mail/again/${email}`);
	}

	public static async resetPassword(email: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.get(`/user/password/reset/${email}`);
	}

	public static async newPassword(
		passwordResetId: string,
		password: string = ""
	): Promise<AxiosResponse<AuthResponse>> {
		if (password) {
			return $api.post(`/user/password/new/${passwordResetId}`, { password });
		}

		return $api.get(`/user/password/new/${passwordResetId}`);
	}
}
