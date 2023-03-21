import { FC, ReactElement, Fragment, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

// mui components
import { TextField, Typography, Box } from "@mui/material";

// components
import Button from "../../../components/Button";

// styles
import styles from "./ResetForm.module.scss";

// types
import { FormikTouched, FormikErrors } from "formik/dist/types";
import { ResetValues } from "../containers";

type ResetFormProps = {
	values: ResetValues;
	touched: FormikTouched<ResetValues>;
	errors: FormikErrors<ResetValues>;
	isSubmitting: boolean;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const ResetForm: FC<ResetFormProps> = (props): ReactElement => {
	const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

	return (
		<Fragment>
			<Box className={styles["auth__top"]}>
				<Typography variant="h2">Забыли свой пароль?</Typography>
				<Typography>
					Пожалуйста, введите адрес электронной почты, связанный с вашей учетной записью. Мы отправим вам письмо с
					ссылкой для сброса вашего пароля.
				</Typography>
			</Box>

			<form className={styles["auth__form"]} onSubmit={handleSubmit}>
				<TextField
					fullWidth
					id={`${!touched["email"] ? "outlined-email" : errors["email"] ? "outlined-error" : "outlined-email"}`}
					type="email"
					label="Email"
					name="email"
					error={!touched["email"] ? false : errors["email"] ? true : false}
					helperText={!touched["email"] ? " " : errors["email"] ? errors["email"] : " "}
					value={values["email"]}
					onChange={handleChange}
					onBlur={handleBlur}
					sx={{
						"& fieldset": {
							borderRadius: "8px",
						},

						marginBottom: "10px",
					}}
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

				<Button
					loading={isSubmitting}
					type="submit"
					styles={{
						padding: "10px 12px",
						fontSize: 16,
						letterSpacing: 0.5,
						marginBottom: "20px",
					}}
				>
					Отправить письмо
				</Button>

				<Link to={"/auth/signin"} className={styles["auth__form-link"]}>
					Вернуться назад для входа в систему
				</Link>
			</form>
		</Fragment>
	);
};

export default ResetForm;
