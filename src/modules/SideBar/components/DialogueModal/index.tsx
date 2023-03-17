import { FC, ReactElement, ChangeEvent } from "react";

// style
import styles from "./DialogueModal.module.scss";

// components
import { Modal, Input, Typography } from "antd";

// icons
import { MailOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

type DialogueModalProps = {
	isModalOpen: boolean;
	isLoading: boolean;
	emailValue: string;
	messageValue: string;
	handleOk: () => void;
	handleCancel: () => void;
	handleChangeValue: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const DialogueModal: FC<DialogueModalProps> = (props): ReactElement => {
	const { isModalOpen, isLoading, emailValue, messageValue, handleOk, handleCancel, handleChangeValue } = props;

	return (
		<Modal
			title={
				<Title level={3} className={styles["modal__title"]}>
					Создать диалог
				</Title>
			}
			open={isModalOpen}
			onOk={handleOk}
			onCancel={handleCancel}
			centered
			cancelText="Закрыть"
			okText="Создать"
			cancelButtonProps={{ size: "large" }}
			okButtonProps={{ size: "large", disabled: emailValue === "" || messageValue === "", loading: isLoading }}
		>
			<Input
				size="large"
				placeholder="Введите email пользователя"
				suffix={<MailOutlined />}
				type="email"
				value={emailValue}
				onChange={handleChangeValue}
				className={styles["modal__input"]}
			/>

			{emailValue && (
				<TextArea
					size="large"
					rows={3}
					placeholder="Ваше сообщение"
					className={styles["modal__textarea"]}
					value={messageValue}
					onChange={handleChangeValue}
				/>
			)}
		</Modal>
	);
};

export default DialogueModal;
