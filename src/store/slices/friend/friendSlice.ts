import { RootState } from "../../index";
import { createSlice } from "@reduxjs/toolkit";

// types
import { Status } from "../../../models/Status";
import IUser from "../../../models/IUser";

// actions
import { getFriends, getRequests, acceptFriend, denyFriend, removeFriend } from "./friendActions";

interface IFriendState {
	status: Status;
	friends: IUser[];
	requests: IUser[];
	requestsLength: number;
}

const initialState: IFriendState = {
	status: Status["IDLE"],
	friends: [],
	requests: [],
	requestsLength: 0,
};

export const friendSlice = createSlice({
	name: "friend",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// get friends
			.addCase(getFriends.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(getFriends.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.friends = action.payload;
				}
			})
			.addCase(getFriends.rejected, (state) => {
				state.status = Status["ERROR"];
			})
			// get requests
			.addCase(getRequests.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(getRequests.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.requests = action.payload;
					state.requestsLength = action.payload.length;
				}
			})
			.addCase(getRequests.rejected, (state) => {
				state.status = Status["ERROR"];
			})
			// accept friend request
			.addCase(acceptFriend.pending, () => {})
			.addCase(acceptFriend.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					const friend = state.requests.find((request) => request._id === action.payload);

					if (friend) {
						state.friends.push(friend);
						state.requests = state.requests.filter((request) => request._id !== action.payload);
						state.requestsLength = state.requests.length;
					}
				}
			})
			.addCase(acceptFriend.rejected, (state) => {
				state.status = Status["ERROR"];
			})
			// deny friend request
			.addCase(denyFriend.pending, () => {})
			.addCase(denyFriend.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.requests = state.requests.filter((request) => request._id !== action.payload);
					state.requestsLength = state.requests.length;
				}
			})
			.addCase(denyFriend.rejected, (state) => {
				state.status = Status["ERROR"];
			})
			// remove friend
			.addCase(removeFriend.pending, () => {})
			.addCase(removeFriend.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.friends = state.friends.filter((friend) => friend._id !== action.payload);
				}
			})
			.addCase(removeFriend.rejected, (state) => {
				state.status = Status["ERROR"];
			});
	},
});

export const friendSelector = (state: RootState) => state.friend;
export default friendSlice.reducer;
