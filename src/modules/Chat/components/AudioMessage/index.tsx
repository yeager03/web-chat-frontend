import { FC, ReactElement, useEffect, useRef, useState } from "react";

// hooks
import useAudio from "../../../../context/context";

// style
import styles from "./AudioMessage.module.scss";

// images
import AudioWaveIcon from "../../../../assets/images/audio-wave.svg";
import AudioPlayIcon from "../../../../assets/images/audio-play.svg";
import AudioPauseIcon from "../../../../assets/images/audio-pause.svg";

// convert time
import getConvertedTime from "../../../../utils/convertTime";

// types
import { AudioFileStatus } from "../../../../context/AudioProvider";

interface IAudioProgress {
  currentTime: number;
  progressBar: number;
}

type AudioMessageProps = {
  _id: string;
  src: string;
  title: string;
};

const AudioMessage: FC<AudioMessageProps> = (props): ReactElement => {
  const { _id, src, title } = props;

  const { audioFiles, setAudioFileDuration, setAudioFileStatus } = useAudio();
  const currentAudio = audioFiles.find((file) => file._id === _id);

  const [isAudioPlaying, setAudioPlaying] = useState<AudioFileStatus>(
    AudioFileStatus.IDLE
  );
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<IAudioProgress>({
    currentTime: 0,
    progressBar: 0,
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentAudio) {
      // console.log(currentAudio.duration);

      setAudioPlaying(currentAudio.status);
      setAudioDuration(currentAudio.duration);
    }
  }, [currentAudio?.status]);

  useEffect(() => {
    const element = audioRef.current;

    function audioMetaData() {
      if (element) {
        setAudioDuration(
          element.duration < 1
            ? Math.floor(element.duration * 1000)
            : Math.floor(element.duration)
        );
        setAudioFileDuration(
          _id,
          element.duration < 1
            ? Math.floor(element.duration * 1000)
            : Math.floor(element.duration)
        );
      }
    }

    function audioPlay() {
      if (element) {
        element.volume = 0.05;

        const audioPlayers = document.querySelectorAll("audio");

        audioPlayers.forEach((elem) => {
          if (elem !== element) {
            const id = elem.dataset.id || "";

            elem.volume = 0;
            elem.currentTime = 0;
            elem.pause();

            setAudioFileStatus(id, AudioFileStatus.IDLE);
          }
        });
      }
    }

    function audioPlaying() {
      setAudioPlaying(AudioFileStatus.PLAYING);
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
        setAudioPlaying(AudioFileStatus.IDLE);
        setAudioDuration(
          element.duration < 1
            ? Math.floor(element.duration * 1000)
            : Math.floor(element.duration)
        );
        setAudioProgress({
          ...audioProgress,
          currentTime: 0,
          progressBar: 0,
        });
        setAudioFileStatus(_id, AudioFileStatus.IDLE);
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
  }, []);

  const handleClick = (id: string) => {
    if (audioRef.current) {
      setAudioFileStatus(
        id,
        isAudioPlaying !== "playing"
          ? AudioFileStatus.PLAYING
          : AudioFileStatus.PAUSE
      );
      isAudioPlaying === "playing"
        ? audioRef.current.pause()
        : audioRef.current.play();
      setAudioDuration(Math.floor(audioProgress.currentTime));
    }
  };

  const idle =
    isAudioPlaying === "idle" ? getConvertedTime(audioDuration) : null;
  const playing =
    isAudioPlaying === "playing" || isAudioPlaying === "pause"
      ? getConvertedTime(audioProgress.currentTime)
      : null;

  return (
    <div className={styles["message__audio"]}>
      <div
        className={styles["message__audio-progress"]}
        style={{ width: `${audioProgress.progressBar}%` }}
      ></div>
      <div className={styles["message__audio-info"]}>
        <audio
          controls
          src={src}
          preload="auto"
          className={styles["audio"]}
          ref={audioRef}
          data-id={_id}
        />

        <button
          className={styles["button"]}
          onClick={() => {
            handleClick(_id);
          }}
        >
          {isAudioPlaying !== "playing" ? (
            <img src={AudioPlayIcon} alt="Audio play img" />
          ) : (
            <img src={AudioPauseIcon} alt="Audio pause img" />
          )}
        </button>
        <div className={styles["image"]}>
          <img src={AudioWaveIcon} alt="Audio Wave img" />
        </div>
        <div className={styles["information"]}>
          <span className={styles["information__title"]}>
            {title.includes("audio-message") ? "Аудиосообщение" : title}
          </span>
          <span className={styles["information__duration"]}>
            {idle}
            {playing}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioMessage;
