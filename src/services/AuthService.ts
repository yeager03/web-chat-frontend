import { AxiosResponse } from "axios";
import $api from "../core/axios";

// types
import AuthResponse from "../models/response/AuthResponse";

export default class AuthService {
	public static async signIn(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/signin", { email, password });
	}

	public static async signUp(email: string, fullName: string, password: string): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>("/user/signup", { email, fullName, password });
	}

	public static async logout(): Promise<AxiosResponse<void>> {
		return $api.post("/logout");
	}
}
