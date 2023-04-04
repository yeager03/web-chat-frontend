import { FC, ReactElement, ChangeEvent, FormEvent } from "react";

// mui components
import { Typography, Modal, TextField } from "@mui/material";

// components
import Button from "../../../../components/Button";

// mui icons
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// style
import styles from "./FriendModal.module.scss";

// types
import { FriendModalValues } from "../../containers";
import { FormikErrors, FormikTouched } from "formik";

type FriendModalProps = {
	isModalOpen: boolean;
	// formik
	isSubmitting: boolean;
	values: FriendModalValues;
	touched: FormikTouched<FriendModalValues>;
	errors: FormikErrors<FriendModalValues>;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleOk: (e: FormEvent<HTMLFormElement>) => void;
	handleCancel: () => void;
};

const FriendModal: FC<FriendModalProps> = (props): ReactElement => {
	const { isModalOpen, isSubmitting, values, touched, errors, handleChange, handleBlur, handleOk, handleCancel } =
		props;

	return (
		<Modal open={isModalOpen} onClose={handleCancel}>
			<form className={styles["modal"]} onSubmit={handleOk}>
				<Typography component="span" className={styles["modal__icon"]} onClick={handleCancel}>
					<CloseRoundedIcon />
				</Typography>
				<Typography variant="h3" className={styles["modal__title"]}>
					Добавить в друзья
				</Typography>
				<Typography className={styles["modal__description"]}>
					Введите email друга, чтобы отправить заявку в друзья
				</Typography>

				<TextField
					fullWidth
					id={`${!touched["email"] ? "outlined-email" : errors["email"] ? "outlined-error" : "outlined-email"}`}
					type="email"
					label="Email"
					name="email"
					error={!touched["email"] ? false : errors["email"] ? true : false}
					helperText={!touched["email"] ? " " : errors["email"] ? errors["email"] : " "}
					value={values.email}
					onChange={handleChange}
					onBlur={handleBlur}
					className={styles["modal__input"]}
					FormHelperTextProps={{
						sx: {
							margin: 0,
							marginLeft: "5px",
							fontWeight: 600,
							height: "15px",
							opacity: !touched["email"] ? 0 : errors["email"] ? 1 : 0,
							transition: "opacity .25s ease-out",
						},
					}}
				/>
				{!touched["email"] ? null : errors["email"] ? null : (
					<Button loading={isSubmitting} type="submit" className={styles["modal__button"]} fullWidth>
						Отправить заявку
					</Button>
				)}
			</form>
		</Modal>
	);
};

export default FriendModal;
