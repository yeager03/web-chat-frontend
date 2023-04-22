import { createAsyncThunk } from "@reduxjs/toolkit";

// utils
import decryptionText from "../../../utils/decryptionText";

// service
import DialogueService from "../../../services/DialogueService";

// types
import IDialogue from "../../../models/IDialogue";

export const getDialogues = createAsyncThunk<IDialogue[]>("dialogue/getDialogues", async () => {
	const response = await DialogueService.getDialogues();
	const { dialogues } = response.data;

	return dialogues.map((item) => ({
		...item,
		lastMessage: {
			...item.lastMessage,
			message: item.lastMessage.message ? decryptionText(item.lastMessage.message) : "Изображения",
		},
	}));
});
