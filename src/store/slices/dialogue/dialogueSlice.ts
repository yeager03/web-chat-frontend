import { RootState } from "../../index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { Status } from "../../../models/Status";
import IDialogue from "../../../models/IDialogue";
import IMessage from "../../../models/IMessage";

// actions
import { getDialogues } from "./dialogueActions";

interface IDialogueState {
  status: Status;
  dialogues: IDialogue[];
  currentDialogueId: string;
  currentDialogue: IDialogue | null;
  unreadMessagesCount: number;
}

const initialState: IDialogueState = {
  status: Status["IDLE"],
  dialogues: [],
  currentDialogueId: "",
  currentDialogue: null,
  unreadMessagesCount: 0,
};

export const dialogueSlice = createSlice({
  name: "dialogue",
  initialState,
  reducers: {
    setCurrentDialogueId: (state, action: PayloadAction<string>) => {
      state.currentDialogueId = action.payload;
    },
    setCurrentDialogue: (state, action: PayloadAction<IDialogue | null>) => {
      state.currentDialogue = action.payload;
    },
    changeDialogueMessage: (
      state,
      action: PayloadAction<{
        dialogueId: string;
        message: IMessage;
      }>
    ) => {
      if (state.currentDialogue?._id === action.payload.dialogueId) {
        state.currentDialogue.lastMessage = action.payload.message;
        state.dialogues = state.dialogues.map((dialogue) => {
          if (dialogue._id === action.payload.dialogueId) {
            dialogue.lastMessage = action.payload.message;
          }
          return dialogue;
        });
      }
      state.dialogues = state.dialogues.map((dialogue) => {
        if (dialogue._id === action.payload.dialogueId) {
          dialogue.lastMessage = action.payload.message;
        }
        return dialogue;
      });
    },
    increaseUnreadMessageCount: (state) => {
      state.unreadMessagesCount = state.unreadMessagesCount + 1;
    },
    decreaseUnreadMessageCount: (state, action: PayloadAction<number>) => {
      if (state.unreadMessagesCount > 0) {
        state.unreadMessagesCount = state.unreadMessagesCount - action.payload;
      }
    },
    readDialogueLastMessage: (state, action: PayloadAction<string>) => {
      if (state.currentDialogue?._id === action.payload) {
        state.currentDialogue.lastMessage.isRead = true;
      }
      state.dialogues = state.dialogues.map((dialogue) => {
        if (dialogue._id === action.payload) {
          dialogue.lastMessage.isRead = true;
        }
        return dialogue;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDialogues.pending, (state) => {
        state.status = Status["LOADING"]; // ?
      })
      .addCase(getDialogues.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = Status["SUCCESS"];
          state.dialogues = action.payload.dialogues;
          state.unreadMessagesCount = action.payload.unreadMessagesCount;
        }
      })
      .addCase(getDialogues.rejected, (state) => {
        state.status = Status["ERROR"];
      });
  },
});

export const dialogueSelector = (state: RootState) => state.dialogue;
export const {
  setCurrentDialogueId,
  setCurrentDialogue,
  changeDialogueMessage,
  increaseUnreadMessageCount,
  decreaseUnreadMessageCount,
  readDialogueLastMessage,
} = dialogueSlice.actions;
export default dialogueSlice.reducer;
