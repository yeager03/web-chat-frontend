import { FC, ReactElement, ChangeEvent, FormEvent } from "react";

// mui components
import { Typography, Modal, TextField } from "@mui/material";

// components
import Button from "../../../../components/Button";

// mui icons
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// style
import styles from "./MessageModal.module.scss";

type MessageModalProps = {
	isModalOpen: boolean;
	isSubmitting: boolean;
	messageValue: string;
	handleOk: (e: FormEvent<HTMLFormElement>) => void;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleCancel: () => void;
};

const MessageModal: FC<MessageModalProps> = (props): ReactElement => {
	const { isModalOpen, isSubmitting, messageValue, handleChange, handleOk, handleCancel } = props;

	return (
		<Modal open={isModalOpen} onClose={handleCancel}>
			<form className={styles["modal"]} onSubmit={handleOk}>
				<Typography component="span" className={styles["modal__icon"]} onClick={handleCancel}>
					<CloseRoundedIcon />
				</Typography>
				<Typography variant="h3" className={styles["modal__title"]}>
					Новое сообщение
				</Typography>
				<Typography className={styles["modal__description"]}>Пожалуйста, введите ваше сообщение</Typography>

				<TextField
					fullWidth
					type="text"
					label="Сообщение"
					name="message"
					value={messageValue}
					onChange={handleChange}
					className={styles["modal__input"]}
					multiline
				/>
				{messageValue.trim().length ? (
					<Button loading={isSubmitting} type="submit" className={styles["modal__button"]} fullWidth>
						Отправить сообщение
					</Button>
				) : null}
			</form>
		</Modal>
	);
};

export default MessageModal;
