import { createAsyncThunk } from "@reduxjs/toolkit";

// service
import DialogueService from "../../../services/DialogueService";

// types
import IDialogue from "../../../models/IDialogue";

export const getDialogues = createAsyncThunk<IDialogue[]>("dialogue/getDialogues", async () => {
	const response = await DialogueService.getDialogues();
	const { dialogues } = response.data;

	return dialogues;
});
