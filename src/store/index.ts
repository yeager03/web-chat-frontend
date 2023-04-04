import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// slices
import dialogue from "./slices/dialogue/dialogueSlice";
import message from "./slices/message/messageSlice";
import user from "./slices/user/userSlice";
import friend from "./slices/friend/friendSlice";

export const store = configureStore({
	reducer: { dialogue, message, user, friend },
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
	devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
