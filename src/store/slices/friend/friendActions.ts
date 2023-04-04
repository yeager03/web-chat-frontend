import { createAsyncThunk } from "@reduxjs/toolkit";

// service
import UserService from "../../../services/UserService";

// utils
import getNotification from "../../../utils/notification";

// types
import FriendsResponse from "../../../models/response/FriendsResponse";
import RequestsResponse from "../../../models/response/RequestsResponse";
import UserResponse from "../../../models/response/UserResponse";
import IUser from "../../../models/IUser";

export const getFriends = createAsyncThunk<IUser[], undefined>("friend/getFriends", async () => {
	const response = await UserService.getFriends();
	const { friends }: FriendsResponse = response.data;

	return friends;
});

export const getRequests = createAsyncThunk<IUser[], undefined>("request/getRequest", async () => {
	const response = await UserService.getRequests();
	const { requests }: RequestsResponse = response.data;

	return requests;
});

export const acceptFriend = createAsyncThunk<string, string, { rejectValue: string }>(
	"friend/acceptFriend",
	async (friendId, thunkApi) => {
		try {
			const response = await UserService.acceptRequest(friendId);
			const { status, message }: UserResponse = response.data;

			if (status === "success") {
				getNotification(message, status);
			}

			return friendId;
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification(message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);

export const denyFriend = createAsyncThunk<string, string, { rejectValue: string }>(
	"friend/denyFriend",
	async (friendId, thunkApi) => {
		try {
			const response = await UserService.denyRequest(friendId);
			const { status, message }: UserResponse = response.data;

			if (status === "success") {
				getNotification(message, status);
			}

			return friendId;
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification(message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);

export const removeFriend = createAsyncThunk<string, string, { rejectValue: string }>(
	"friend/removeFriend",
	async (friendId, thunkApi) => {
		try {
			const response = await UserService.removeFriend(friendId);
			const { status, message }: UserResponse = response.data;

			if (status === "success") {
				getNotification(message, status);
			}

			return friendId;
		} catch (error: any) {
			if (error.response && error.response.data) {
				const { status, message } = error.response.data;

				if (status === "error") {
					getNotification(message, status);
				}

				return thunkApi.rejectWithValue(message);
			} else {
				return thunkApi.rejectWithValue(error.message);
			}
		}
	}
);
