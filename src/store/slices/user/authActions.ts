import { createAsyncThunk } from "@reduxjs/toolkit";

// service
import AuthService from "../../../services/AuthService";

// utils
import getNotification from "../../../utils/notification";

// types
import IUser from "../../../models/IUser";
import AuthResponse from "../../../models/response/AuthResponse";

// default axios
import axios from "axios";

// url
import { API_URL } from "../../../core/axios";

type AuthReturnData = {
	accessToken: string;
	user: IUser;
};

type SignInData = {
	email: string;
	password: string;
};

type SignUpData = {
	email: string;
	fullName: string;
	password: string;
};

export const signUp = createAsyncThunk<void, SignUpData, { rejectValue: string }>(
	"user/signUp",
	async ({ email, fullName, password }, thunkApi) => {
		try {
			const response = await AuthService.signUp(email, fullName, password);
			const { status, message }: AuthResponse = response.data;

			if (status === "success") {
				getNotification("Успех", message, status);
			}
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification("Ошибка при регистрации", message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);

export const signIn = createAsyncThunk<AuthReturnData, SignInData, { rejectValue: string }>(
	"user/signIn",
	async ({ email, password }, thunkApi) => {
		try {
			const response = await AuthService.signIn(email, password);
			const { status, message, accessToken, user }: AuthResponse = response.data;

			localStorage.setItem("token", accessToken);

			if (status === "success") {
				getNotification("Успех", message, status);
			}

			return { accessToken, user };
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification("Ошибка при авторизации", message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);

export const logOut = createAsyncThunk<void, undefined, { rejectValue: string }>(
	"user/logOut",
	async (_: undefined, thunkApi) => {
		try {
			await AuthService.logout();
			localStorage.removeItem("token");
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification("Ошибка при выходе из аккаунта", message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);

export const checkAuth = createAsyncThunk<AuthReturnData, undefined, { rejectValue: string }>(
	"user/checkAuth",
	async (_: undefined, thunkApi) => {
		try {
			const response = await axios.get<AuthResponse>(`${API_URL}/user/refresh`, {
				withCredentials: true,
			});
			const { accessToken, user } = response.data;

			localStorage.setItem("token", accessToken);

			return { accessToken, user };
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { message } = error.response.data;

				localStorage.removeItem("token");

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);
