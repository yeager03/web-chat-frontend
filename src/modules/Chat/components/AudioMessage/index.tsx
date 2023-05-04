import { FC, ReactElement, useEffect, useRef, useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";

// style
import styles from "./AudioMessage.module.scss";

// images
import AudioWaveIcon from "../../../../assets/images/audio-wave.svg";
import AudioPlayIcon from "../../../../assets/images/audio-play.svg";
import AudioPauseIcon from "../../../../assets/images/audio-pause.svg";

// convert time
import getConvertedTime from "../../../../utils/convertTime";

// actions
import {
  audioSelector,
  MediaFileStatus,
  setMediaFileDuration,
  setMediaFileStatus,
} from "../../../../store/slices/audio/audioSlice";
import { IFile } from "../../../../models/IMessage";

interface IAudioProgress {
  currentTime: number;
  progressBar: number;
}

type AudioMessageProps = {
  _id: string;
  src: string;
  title: string;
  uploadedFiles: IFile[];
};

const AudioMessage: FC<AudioMessageProps> = (props): ReactElement => {
  const { _id, src, title, uploadedFiles } = props;

  const { mediaFiles } = useSelector(audioSelector);
  const currentAudio = mediaFiles.find((file) => file._id === _id);

  const [isAudioPlaying, setAudioPlaying] = useState<MediaFileStatus>(
    MediaFileStatus.IDLE
  );
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<IAudioProgress>({
    currentTime: 0,
    progressBar: 0,
  });

  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentAudio) {
      setAudioPlaying(currentAudio.status);
      setAudioDuration(currentAudio.duration);

      console.log("duration status changed init");
    }
  }, [currentAudio?.status]);

  useEffect(() => {
    const element = audioRef.current;

    function audioMetaData() {
      if (element) {
        setAudioDuration(Math.floor(element.duration));
        dispatch(
          setMediaFileDuration({
            id: _id,
            duration: Math.floor(element.duration),
          })
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
            elem.pause();
            elem.currentTime = 0;

            dispatch(
              setMediaFileStatus({
                id,
                status: MediaFileStatus.IDLE,
              })
            );
          }
        });
      }
    }

    function audioPlaying() {
      setAudioPlaying(MediaFileStatus.PLAYING);
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
        setAudioPlaying(MediaFileStatus.IDLE);
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
  }, []);

  useEffect(() => {
    const audioPlayers = document.querySelectorAll("audio");

    audioPlayers.forEach((audio) => {
      const id = audio.dataset.id || "";

      dispatch(
        setMediaFileDuration({
          id,
          duration: Math.floor(audio.duration),
        })
      );
    });
  }, [uploadedFiles.length]);

  const handleClick = (id: string) => {
    if (audioRef.current) {
      dispatch(
        setMediaFileStatus({
          id,
          status:
            isAudioPlaying !== "playing"
              ? MediaFileStatus.PLAYING
              : MediaFileStatus.PAUSE,
        })
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
          <span className={styles["information__title"]}>{title}</span>
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
