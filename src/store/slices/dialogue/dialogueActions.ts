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
        const audioFiles = item.lastMessage.files.filter(
          (file) => file.type === "audio"
        );
        const imageFiles = item.lastMessage.files.filter(
          (file) => file.type === "image"
        );

        if (audioFiles.length && !imageFiles.length) {
          lastMessageInfo = "Аудио";
        } else if (imageFiles.length && !audioFiles.length) {
          lastMessageInfo = "Изображения";
        } else {
          lastMessageInfo = "Файлы";
        }
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
