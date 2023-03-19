import { FC, ReactElement, Fragment, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

// mui components
import { TextField, Typography, IconButton, InputAdornment, Box } from "@mui/material";

// mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// components
import Button from "../../../components/Button";

// styles
import styles from "./SignInForm.module.scss";

// types
import { FormikTouched, FormikErrors } from "formik/dist/types";
import { SignInValues } from "../containers";

type SignInFormProps = {
	values: SignInValues;
	touched: FormikTouched<SignInValues>;
	errors: FormikErrors<SignInValues>;
	isSubmitting: boolean;
	showPassword: boolean;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
	handleClickShowPassword: () => void;
};

const SignInForm: FC<SignInFormProps> = (props): ReactElement => {
	const {
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

	return (
		<Fragment>
			<Box className={styles["auth__top"]}>
				<Typography variant="h2">Войти в аккаунт</Typography>
				<Box className={styles["auth__top-link"]}>
					<Typography>Нет аккаунта?</Typography>
					<Link to="/auth/signup">Создать аккаунт</Link>
				</Box>
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

				<Link to="/auth/reset" className={styles["auth__form-link"]}>
					Забыли пароль?
				</Link>

				<Button
					loading={isSubmitting}
					type="submit"
					styles={{
						padding: "10px 12px",
						fontSize: 16,
						letterSpacing: 0.5,
					}}
				>
					Войти в аккаунт
				</Button>
			</form>
		</Fragment>
	);
};

export default SignInForm;
