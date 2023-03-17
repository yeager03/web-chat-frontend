import { FC, ReactElement, useEffect, useRef, useState } from "react";

// style
import styles from "./AudioMessage.module.scss";

// images
import AudioWave from "../../../../assets/images/audio-wave.svg";
import AudioPlay from "../../../../assets/images/audio-play.svg";
import AudioPause from "../../../../assets/images/audio-pause.svg";

// convert time
import getConvertedTime from "../../../../utils/convertTime";

type AudioMessageProps = {
	audio: string;
};

interface IAudioProgress {
	currentTime: number;
	progressBar: number;
}

const AudioMessage: FC<AudioMessageProps> = (props): ReactElement => {
	const { audio } = props;

	const [isAudioPlaying, setAudioPlaying] = useState<boolean>(false);
	const [audioDuration, setAudioDuration] = useState<number>(0);
	const [audioProgress, setAudioProgress] = useState<IAudioProgress>({
		currentTime: 0,
		progressBar: 0,
	});
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const { currentTime, progressBar } = audioProgress;

	const handlePlayClick = () => {
		if (audioRef.current) {
			if (isAudioPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setAudioDuration(Math.floor(currentTime));
			setAudioPlaying(!isAudioPlaying);
		}
	};

	useEffect(() => {
		const element = audioRef.current;

		function audioMetaData() {
			if (element) {
				setAudioDuration(Math.floor(element.duration));
			}
		}

		function audioPlay() {
			if (element) {
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
	}, []);

	return (
		<div className={styles["message__audio"]}>
			<div className={styles["message__audio-progress"]} style={{ width: `${progressBar}%` }}></div>
			<div className={styles["message__audio-info"]}>
				<audio controls src={audio} preload="auto" className={styles["audio"]} ref={audioRef} />

				<button className={styles["button"]} onClick={handlePlayClick}>
					{isAudioPlaying ? (
						<img src={AudioPause} alt="Audio pause img" />
					) : (
						<img src={AudioPlay} alt="Audio play img" />
					)}
				</button>
				<div className={styles["image"]}>
					<img src={AudioWave} alt="Audio Wave img" />
				</div>
				<span className={styles["duration"]}>
					{isAudioPlaying ? getConvertedTime(currentTime) : getConvertedTime(audioDuration)}
				</span>
			</div>
		</div>
	);
};

export default AudioMessage;
