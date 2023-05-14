import { FC, ReactNode, ReactElement, useState } from "react";

// context
import { AudioContext } from "./context";

export enum AudioFileStatus {
  IDLE = "idle",
  PLAYING = "playing",
  PAUSE = "pause",
}

export interface IAudioFile {
  _id: string;
  title: string;
  status: AudioFileStatus;
  duration: number;
}

type AudioProvider = {
  children: ReactNode;
};

const AudioProvider: FC<AudioProvider> = ({ children }): ReactElement => {
  const [audioFiles, setAudioFiles] = useState<IAudioFile[]>([]);

  const addAudioFile = (audioFile: IAudioFile) => {
    const isExist = audioFiles.find((item) => item._id === audioFile._id);

    if (!isExist) {
      setAudioFiles((prevState) => [...prevState, audioFile]);
    }
  };

  const removeAudioFile = (id: string) => {
    setAudioFiles((prevState) => prevState.filter((item) => item._id !== id));
  };

  const setAudioFileDuration = (id: string, duration: number) => {
    setAudioFiles((prevState) =>
      prevState.map((item) => {
        if (item._id === id) {
          item.duration = duration;
        }
        return item;
      })
    );
  };

  const setAudioFileStatus = (id: string, status: AudioFileStatus) => {
    setAudioFiles((prevState) =>
      prevState.map((item) => {
        if (item._id === id) {
          item.status = status;
        }
        return item;
      })
    );
  };

  const clearAudioFiles = () => setAudioFiles([]);

  return (
    <AudioContext.Provider
      value={{
        audioFiles,
        addAudioFile,
        removeAudioFile,
        setAudioFileDuration,
        setAudioFileStatus,
        clearAudioFiles,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
