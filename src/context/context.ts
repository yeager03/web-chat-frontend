import { createContext, useContext } from "react";

// types
import { AudioFileStatus, IAudioFile } from "./AudioProvider";

interface IContext {
  audioFiles: IAudioFile[];
  addAudioFile: (audioFile: IAudioFile) => void;
  removeAudioFile: (id: string) => void;
  setAudioFileDuration: (id: string, duration: number) => void;
  setAudioFileStatus: (id: string, status: AudioFileStatus) => void;
  clearAudioFiles: () => void;
}
export const AudioContext = createContext<IContext>({
  audioFiles: [],
  addAudioFile: (audioFile) => {},
  removeAudioFile: (id) => {},
  setAudioFileDuration: (id, duration) => {},
  setAudioFileStatus: (id, status) => {},
  clearAudioFiles: () => {},
});

const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context && typeof window !== "undefined") {
    throw new Error(`useAudio must be used within a AudioContext `);
  }
  return context;
};

export default useAudio;
