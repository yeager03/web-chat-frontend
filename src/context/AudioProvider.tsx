import {
  FC,
  ReactNode,
  ReactElement,
  useState,
  useEffect,
  useRef,
} from "react";
// context

import { AudioContext } from "./context";

export interface IAudioProgress {
  currentTime: number;
  progressBar: number;
}

type AudioProvider = {
  children: ReactNode;
};

const AudioProvider: FC<AudioProvider> = ({ children }): ReactElement => {
  const [currentAudioId, setCurrentAudioId] = useState<string>("");
  const [audioSource, setAudioSource] = useState<string>("");

  const [isAudioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<IAudioProgress>({
    currentTime: 0,
    progressBar: 0,
  });

  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const element = audio.current;

    function audioMetaData() {
      if (element) {
        setAudioDuration(Math.floor(element.duration));
      }
    }

    function audioPlay() {
      if (element) {
        console.log("volume");
        element.volume = 0.1;
      }
    }

    function audioPlaying() {
      setAudioPlaying(true);
    }

    function audioTimeUpdate() {
      if (element) {
        const duration = element.duration;
        const currentTime = element.currentTime;

        setAudioProgress({
          ...audioProgress,
          currentTime: currentTime,
          progressBar: (currentTime / duration) * 100,
        });
      }
    }

    function audioEnded() {
      if (element) {
        setAudioPlaying(false);
        setAudioDuration(Math.floor(element.duration));
        setAudioProgress({
          ...audioProgress,
          currentTime: 0,
          progressBar: 0,
        });
      }
    }

    element?.addEventListener("loadedmetadata", audioMetaData);
    element?.addEventListener("play", audioPlay);
    element?.addEventListener("playing", audioPlaying);
    element?.addEventListener("timeupdate", audioTimeUpdate);
    element?.addEventListener("ended", audioEnded);

    return () => {
      element?.removeEventListener("loadedmetadata", audioMetaData);
      element?.removeEventListener("play", audioPlay);
      element?.removeEventListener("playing", audioPlaying);
      element?.removeEventListener("timeupdate", audioTimeUpdate);
      element?.removeEventListener("ended", audioEnded);
    };
  }, [audio.current]);

  const initAudio = (source: string) => {
    // @ts-ignore
    audio.current = new Audio(source);

    console.log("audio init");
  };

  const handlePlayClick = (id: string, source: string) => {
    if (currentAudioId === id) {
      if (audio.current) {
        isAudioPlaying ? audio.current.pause() : audio.current.play();
        setAudioDuration(Math.floor(audioProgress.currentTime));
        setAudioPlaying(!isAudioPlaying);
      }
    } else {
      if (audio.current) {
        audio.current.pause();
      }

      // @ts-ignore
      audio.current = new Audio(source);
      audio.current.play();

      setCurrentAudioId(id);
      setAudioDuration(Math.floor(audioProgress.currentTime));
      setAudioPlaying(true);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isAudioPlaying,
        audioDuration,
        audioProgress,
        handlePlayClick,
        initAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
