import { createContext, useContext } from "react";
import { IAudioProgress } from "./AudioProvider";

interface IContext {
  isAudioPlaying: boolean;
  audioDuration: number;
  audioProgress: IAudioProgress;
  handlePlayClick: (id: string, source: string) => void;
  initAudio: (source: string) => void;
}
export const AudioContext = createContext<IContext>({
  isAudioPlaying: false,
  audioDuration: 0,
  audioProgress: {
    currentTime: 0,
    progressBar: 0,
  },
  handlePlayClick: (id, source) => {},
  initAudio: (source) => {},
});

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context && typeof window !== "undefined") {
    throw new Error(`useAudio must be used within a AudioContext `);
  }
  return context;
};
