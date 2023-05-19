import { RootState } from "../../index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { Status } from "../../../models/Status";
import IDialogue from "../../../models/IDialogue";
import IMessage from "../../../models/IMessage";

// actions
import { getDialogues } from "./dialogueActions";
import { retry } from "@reduxjs/toolkit/query";

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
    increaseUnreadMessageCount: (state, action: PayloadAction<string>) => {
      state.unreadMessagesCount = state.unreadMessagesCount + 1;

      state.dialogues = state.dialogues.map((dialogue) => {
        if (dialogue._id === action.payload) {
          if (dialogue.unreadMessagesCount) {
            dialogue.unreadMessagesCount = dialogue.unreadMessagesCount + 1;
          } else {
            dialogue.unreadMessagesCount = 1;
          }
        }
        return dialogue;
      });
    },
    decreaseUnreadMessageCount: (
      state,
      action: PayloadAction<{ count: number; currentDialogueId: string }>
    ) => {
      if (state.unreadMessagesCount > 0) {
        state.unreadMessagesCount =
          state.unreadMessagesCount - action.payload.count;

        state.dialogues = state.dialogues.map((dialogue) => {
          if (dialogue._id === action.payload.currentDialogueId) {
            dialogue.unreadMessagesCount =
              dialogue.unreadMessagesCount - action.payload.count;
          }
          return dialogue;
        });
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

    socketChangeDialogueFriendStatus: (
      state,
      action: PayloadAction<{ id: string; status: boolean }>
    ) => {
      state.dialogues = state.dialogues.map((dialogue) => {
        if (dialogue.members.find((user) => user._id === action.payload.id)) {
          dialogue.members = dialogue.members.map((user) => {
            if (user._id === action.payload.id) {
              user.isOnline = action.payload.status;
            }
            return user;
          });
        }

        return dialogue;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDialogues.pending, (state) => {
        state.status = Status["LOADING"];
      })
      .addCase(getDialogues.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = Status["SUCCESS"];
          state.dialogues = action.payload;
          state.unreadMessagesCount = action.payload.reduce(
            (prev, dialogue) => {
              if (dialogue.unreadMessagesCount) {
                return prev + dialogue.unreadMessagesCount;
              }

              return prev;
            },
            0
          );
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
  socketChangeDialogueFriendStatus,
  readDialogueLastMessage,
} = dialogueSlice.actions;
export default dialogueSlice.reducer;
