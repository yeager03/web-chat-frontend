import { RootState } from "../../index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum MediaFileStatus {
  IDLE = "idle",
  PLAYING = "playing",
  PAUSE = "pause",
}

export interface IMediaFile {
  _id: string;
  title: string;
  status: MediaFileStatus;
  duration: number;
}

interface IAudioProgress {
  mediaFiles: IMediaFile[];
}

type FileStatusType = {
  id: string;
  status: MediaFileStatus;
};

type FileDurationType = {
  id: string;
  duration: number;
};

const initialState: IAudioProgress = {
  mediaFiles: [],
};

export const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setMediaFiles: (state, action: PayloadAction<IMediaFile>) => {
      const item = state.mediaFiles.find((el) => el._id === action.payload._id);

      if (!item) {
        state.mediaFiles.push(action.payload);
      }
    },

    setMediaFileStatus: (state, action: PayloadAction<FileStatusType>) => {
      state.mediaFiles = state.mediaFiles.map((file) => {
        if (file._id === action.payload.id) {
          file.status = action.payload.status;
        }
        return file;
      });
    },

    setMediaFileDuration: (state, action: PayloadAction<FileDurationType>) => {
      state.mediaFiles = state.mediaFiles.map((file) => {
        if (file._id === action.payload.id) {
          file.duration = action.payload.duration;
        }
        return file;
      });
    },
  },
});

export const audioSelector = (state: RootState) => state.audio;
export const { setMediaFiles, setMediaFileStatus, setMediaFileDuration } =
  audioSlice.actions;
export default audioSlice.reducer;
