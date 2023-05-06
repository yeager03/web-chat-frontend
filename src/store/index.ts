import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// slices
import dialogue from "./slices/dialogue/dialogueSlice";
import message from "./slices/message/messageSlice";
import user from "./slices/user/userSlice";
import friend from "./slices/friend/friendSlice";

const appReducer = combineReducers({ dialogue, message, user, friend });

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === "user/logOut/pending") {
    return appReducer(undefined, { type: undefined });
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
