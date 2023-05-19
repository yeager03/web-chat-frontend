import { RootState } from "../../index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { Status } from "../../../models/Status";
import IUser from "../../../models/IUser";

// actions
import {
  getFriends,
  getRequests,
  acceptFriend,
  denyFriend,
  removeFriend,
} from "./friendActions";

interface IFriendState {
  status: Status;
  friends: IUser[];
  requests: IUser[];
  requestsCount: number;
}

const initialState: IFriendState = {
  status: Status["IDLE"],
  friends: [],
  requests: [],
  requestsCount: 0,
};

export const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    socketAddRequest: (state, action: PayloadAction<IUser>) => {
      state.requests.push(action.payload);
      state.requestsCount = state.requests.length;
    },
    socketAddFriend: (state, action: PayloadAction<IUser>) => {
      state.friends.push(action.payload);
    },
    socketChangeFriendStatus: (
      state,
      action: PayloadAction<{ id: string; status: boolean }>
    ) => {
      state.friends = state.friends.map((friend) => {
        if (friend._id === action.payload.id) {
          friend.isOnline = action.payload.status;
        }

        return friend;
      });
    },
  },
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
          state.requestsCount = action.payload.length;
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
          const friend = state.requests.find(
            (request) => request._id === action.payload
          );

          if (friend) {
            state.friends.push(friend);
            state.requests = state.requests.filter(
              (request) => request._id !== action.payload
            );
            state.requestsCount = state.requests.length;
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
          state.requests = state.requests.filter(
            (request) => request._id !== action.payload
          );
          state.requestsCount = state.requests.length;
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
          state.friends = state.friends.filter(
            (friend) => friend._id !== action.payload
          );
        }
      })
      .addCase(removeFriend.rejected, (state) => {
        state.status = Status["ERROR"];
      });
  },
});

export const friendSelector = (state: RootState) => state.friend;
export const { socketAddRequest, socketAddFriend, socketChangeFriendStatus } =
  friendSlice.actions;
export default friendSlice.reducer;
