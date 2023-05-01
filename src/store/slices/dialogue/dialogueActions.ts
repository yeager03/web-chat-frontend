import { createAsyncThunk } from "@reduxjs/toolkit";

// utils
import decryptionText from "../../../utils/decryptionText";

// service
import DialogueService from "../../../services/DialogueService";

// types
import IDialogue from "../../../models/IDialogue";

export const getDialogues = createAsyncThunk<IDialogue[]>(
  "dialogue/getDialogues",
  async () => {
    const response = await DialogueService.getDialogues();
    const { dialogues } = response.data;

    return dialogues.map((item) => {
      let lastMessageInfo;

      if (item.lastMessage.message && !item.lastMessage.isReference) {
        lastMessageInfo = decryptionText(item.lastMessage.message);
      } else if (item.lastMessage.message && item.lastMessage.isReference) {
        lastMessageInfo = "Ссылка";
      } else {
        lastMessageInfo = "Изображения";
      }

      return {
        ...item,
        lastMessage: {
          ...item.lastMessage,
          message: lastMessageInfo,
        },
      };
    });
  }
);
