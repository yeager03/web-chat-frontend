import { ChangeEvent, FC, ReactElement, useState } from "react";

// antd components
import { Input, Upload, message } from "antd";

// style
import styles from "./ChatInput.module.scss";

// classnames
import cn from "classnames";

// icons
import { SmileOutlined, AudioOutlined, CameraOutlined, SendOutlined } from "@ant-design/icons";

// types
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

// emoji
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

// types
import { Emoji } from "../../containers/ChatInput";

type ChatInputProps = {
	messageValue: string;
	showEmojis: boolean;
	handleChangeSearchValue: (e: ChangeEvent<HTMLInputElement>) => void;
	handleClickShowEmojis: () => void;
	handleClickEmoji: (emoji: Emoji) => void;
};

type FileListComponentProps = {
	originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
	file: UploadFile<any>;
};

const FileListComponent: FC<FileListComponentProps> = (props): ReactElement => {
	console.log(props);
	return <h2 className={styles["file__list"]}>asd</h2>;
};

const ChatInput: FC<ChatInputProps> = (props): ReactElement => {
	const { messageValue, showEmojis, handleChangeSearchValue, handleClickShowEmojis, handleClickEmoji } = props;

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploading, setUploading] = useState(false);

	const handleUpload = () => {
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append("files[]", file as RcFile);
		});
		setUploading(true);

		fetch("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then(() => {
				setFileList([]);
				message.success("upload successfully.");
			})
			.catch(() => {
				message.error("upload failed.");
			})
			.finally(() => {
				setUploading(false);
			});
	};

	const uploadProps: UploadProps = {
		listType: "picture",
		itemRender: (originNode, file) => {
			return <FileListComponent file={file} originNode={originNode} />;
		},
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (file) => {
			setFileList([...fileList, file]);
			return false;
		},
		fileList,
	};

	return (
		<div className={styles["chat-input"]}>
			<div className={styles["chat-input__emoji"]}>
				{showEmojis && <Picker data={data} onEmojiSelect={handleClickEmoji} theme="light" locale="ru" />}
			</div>
			<Input
				addonBefore={
					<SmileOutlined onClick={handleClickShowEmojis} className={cn(styles["icon"], styles["smile-icon"])} />
				}
				addonAfter={
					<div className={styles["input__actions"]}>
						<AudioOutlined className={cn(styles["icon"], styles["smile-audio"])} />
						<Upload {...uploadProps} className={cn(styles["icon"], styles["smile-camera"])}>
							<CameraOutlined />
						</Upload>
						<SendOutlined className={cn(styles["icon"], styles["smile-send"])} />
					</div>
				}
				size="large"
				value={messageValue}
				onChange={handleChangeSearchValue}
				className={styles["input"]}
			/>
		</div>
	);
};

export default ChatInput;
