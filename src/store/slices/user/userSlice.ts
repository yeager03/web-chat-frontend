import { RootState } from "../../index";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// types
import IUser from "../../../models/IUser";
import { Status } from "../../../models/Status";

// actions
import { signIn, signUp, logOut, checkAuth } from "./authActions";

interface IUserState {
	status: Status;
	isAuth: boolean;
	token: string | null;
	user: IUser | null;
	error: string | null;
}

const initialState: IUserState = {
	status: Status.IDLE,
	isAuth: false,
	token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
	user: null,
	error: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setNewProfile: (state, action: PayloadAction<IUser>) => {
			if (action.payload) state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// signUp reducer
			.addCase(signUp.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(signUp.fulfilled, (state) => {
				state.status = Status["SUCCESS"];
				state.error = null;
			})
			.addCase(signUp.rejected, (state, action) => {
				if (action.payload) {
					state.status = Status["ERROR"];
					state.error = action.payload;
				}
			})
			// signIn reducer
			.addCase(signIn.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(signIn.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.isAuth = true;
					state.token = action.payload.accessToken;
					state.user = action.payload.user;
					state.error = null;
				}
			})
			.addCase(signIn.rejected, (state, action) => {
				if (action.payload) {
					state.status = Status["ERROR"];
					state.error = action.payload;
				}
			})

			// logOut reducer
			.addCase(logOut.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(logOut.fulfilled, (state) => {
				state.status = Status["IDLE"];
				state.isAuth = false;
				state.token = null;
				state.user = null;
				state.error = null;
			})
			.addCase(logOut.rejected, (state, action) => {
				if (action.payload) {
					state.status = Status["ERROR"];
					state.error = action.payload;
				}
			})
			// checkAuth reducer
			.addCase(checkAuth.pending, (state) => {
				state.status = Status["LOADING"];
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				if (action.payload) {
					state.status = Status["SUCCESS"];
					state.isAuth = true;
					state.token = action.payload.accessToken;
					state.user = action.payload.user;
					state.error = null;
				}
			})
			.addCase(checkAuth.rejected, (state, action) => {
				if (action.payload) {
					state.status = Status["ERROR"];
					state.error = action.payload;
				}
			});
	},
});

export const userSelector = (state: RootState) => state.user;
export const { setNewProfile } = userSlice.actions;
export default userSlice.reducer;
