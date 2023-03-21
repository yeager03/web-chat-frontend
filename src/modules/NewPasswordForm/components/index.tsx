import { FC, ReactElement, Fragment, ChangeEvent, FormEvent } from "react";

// mui components
import { TextField, Typography, IconButton, InputAdornment, Box, CircularProgress } from "@mui/material";

// mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

// components
import Button from "../../../components/Button";

// styles
import styles from "./NewPasswordForm.module.scss";

// types
import { FormikTouched, FormikErrors } from "formik/dist/types";
import { NewPasswordFormValues, INewPasswordState } from "../containers";

type NewPasswordFormProps = {
	newPasswordState: INewPasswordState;
	values: NewPasswordFormValues;
	touched: FormikTouched<NewPasswordFormValues>;
	errors: FormikErrors<NewPasswordFormValues>;
	isSubmitting: boolean;
	showPassword: boolean;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
	handleClickShowPassword: () => void;
};

const NewPasswordForm: FC<NewPasswordFormProps> = (props): ReactElement => {
	const {
		newPasswordState,
		values,
		touched,
		errors,
		isSubmitting,
		showPassword,
		handleChange,
		handleBlur,
		handleSubmit,
		handleClickShowPassword,
	} = props;

	const { status, message } = newPasswordState;

	const loadingMessage =
		status === "loading" ? (
			<Box className={styles["auth__info"]}>
				<CircularProgress />
			</Box>
		) : null;

	const errorMessage =
		status === "error" ? (
			<Box className={styles["auth__info"]}>
				<ErrorRoundedIcon sx={{ fontSize: 90, color: "#ff4d4f" }} />
				<Typography>{message}</Typography>
			</Box>
		) : null;

	const expiredMessage =
		status === "expired" ? (
			<Box className={styles["auth__info"]}>
				<ErrorRoundedIcon sx={{ fontSize: 90, color: "#ff4d4f" }} />
				<Typography>{message}</Typography>
			</Box>
		) : null;

	const successMessage =
		status === "success" ? (
			<Fragment>
				<Box className={styles["auth__top"]}>
					<Typography variant="h2">Новый пароль</Typography>
					<Typography>Введите новый пароль для своего аккаунта</Typography>
				</Box>

				<form className={styles["auth__form"]} onSubmit={handleSubmit}>
					<TextField
						fullWidth
						id={`${
							!touched["password"]
								? "outlined-password"
								: errors["password"]
								? "outlined-error"
								: "outlined-password"
						}`}
						type={showPassword ? "text" : "password"}
						label="Пароль"
						name="password"
						error={!touched["password"] ? false : errors["password"] ? true : false}
						helperText={!touched["password"] ? " " : errors["password"] ? errors["password"] : " "}
						value={values["password"]}
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
								opacity: !touched["password"] ? 0 : errors["password"] ? 1 : 0,
								transition: "opacity .25s ease-out",
							},
						}}
						InputProps={{
							endAdornment: values["password"] && (
								<InputAdornment position="end">
									<IconButton onClick={handleClickShowPassword} edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<TextField
						fullWidth
						id={`${
							!touched["confirmPassword"]
								? "outlined-confirm-password"
								: errors["confirmPassword"]
								? "outlined-error"
								: "outlined-confirm-password"
						}`}
						type={"password"}
						label="Повторите пароль"
						name="confirmPassword"
						error={!touched["confirmPassword"] ? false : errors["confirmPassword"] ? true : false}
						helperText={
							!touched["confirmPassword"] ? " " : errors["confirmPassword"] ? errors["confirmPassword"] : " "
						}
						value={values["confirmPassword"]}
						onChange={handleChange}
						onBlur={handleBlur}
						sx={{
							"& fieldset": {
								borderRadius: "8px",
							},
							marginBottom: "15px",
						}}
						FormHelperTextProps={{
							sx: {
								margin: 0,
								marginLeft: "5px",
								fontWeight: 600,
								height: "15px",
								opacity: !touched["confirmPassword"] ? 0 : errors["confirmPassword"] ? 1 : 0,
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
						}}
					>
						Сменить пароль
					</Button>
				</form>
			</Fragment>
		) : null;

	return (
		<Fragment>
			{loadingMessage}
			{errorMessage}
			{expiredMessage}
			{successMessage}
		</Fragment>
	);
};

export default NewPasswordForm;
