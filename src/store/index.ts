import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// slices
import dialogues from "./slices/dialoguesSlice";
import messages from "./slices/messagesSlice";

export const store = configureStore({
	reducer: { dialogues, messages },
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
	devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
