import { FC, ReactElement, Fragment, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

// mui components
import { TextField, Typography, IconButton, InputAdornment, Box } from "@mui/material";

// mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";

// components
import Button from "../../../components/Button";

// styles
import styles from "./SignUpForm.module.scss";

// types
import { FormikTouched, FormikErrors } from "formik/dist/types";
import { SignUpValues } from "../containers";

type SignUpFormProps = {
	values: SignUpValues;
	touched: FormikTouched<SignUpValues>;
	errors: FormikErrors<SignUpValues>;
	isSubmitting: boolean;
	success: boolean;
	showPassword: boolean;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
	handleClickShowPassword: () => void;
};

const SignUpForm: FC<SignUpFormProps> = (props): ReactElement => {
	const {
		values,
		touched,
		errors,
		isSubmitting,
		success,
		showPassword,
		handleChange,
		handleBlur,
		handleSubmit,
		handleClickShowPassword,
	} = props;

	if (success) {
		return (
			<Box className={styles["auth__activation"]}>
				<MarkEmailUnreadRoundedIcon sx={{ fontSize: 80 }} />
				<Typography variant="h2">Подтвердите свой аккаунт</Typography>
				<Typography>На вашу почту было отправлено письмо с ссылкой на подтверждение аккаунта.</Typography>
			</Box>
		);
	}

	return (
		<Fragment>
			<Box className={styles["auth__top"]}>
				<Typography variant="h2">Регистрация аккаунта</Typography>
				<Box className={styles["auth__top-link"]}>
					<Typography>У вас уже есть аккаунт?</Typography>
					<Link to="/auth/signin">Войти в аккаунт</Link>
				</Box>
			</Box>
			<form className={styles["auth__form"]} onSubmit={handleSubmit}>
				<Box className={styles["auth__form-fullName"]}>
					<TextField
						fullWidth
						id={`${!touched["name"] ? "outlined-name" : errors["name"] ? "outlined-error" : "outlined-name"}`}
						type="text"
						label="Имя"
						name="name"
						error={!touched["name"] ? false : errors["name"] ? true : false}
						helperText={!touched["name"] ? " " : errors["name"] ? errors["name"] : " "}
						value={values["name"]}
						onChange={handleChange}
						onBlur={handleBlur}
						sx={{
							"& fieldset": {
								borderRadius: "8px",
							},
						}}
						FormHelperTextProps={{
							sx: {
								margin: 0,
								marginLeft: "5px",
								fontWeight: 600,
								height: "15px",
								opacity: !touched["name"] ? 0 : errors["name"] ? 1 : 0,
								transition: "opacity .25s ease-out",
							},
						}}
					/>

					<TextField
						fullWidth
						id={`${
							!touched["surname"]
								? "outlined-surname"
								: errors["surname"]
								? "outlined-error"
								: "outlined-surname"
						}`}
						type="text"
						label="Фамилия"
						name="surname"
						error={!touched["surname"] ? false : errors["surname"] ? true : false}
						helperText={!touched["surname"] ? " " : errors["surname"] ? errors["surname"] : " "}
						value={values["surname"]}
						onChange={handleChange}
						onBlur={handleBlur}
						sx={{
							"& fieldset": {
								borderRadius: "8px",
							},
						}}
						FormHelperTextProps={{
							sx: {
								margin: 0,
								marginLeft: "5px",
								fontWeight: 600,
								height: "15px",
								opacity: !touched["surname"] ? 0 : errors["surname"] ? 1 : 0,
								transition: "opacity .25s ease-out",
							},
						}}
					/>
				</Box>

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

				<Button
					loading={isSubmitting}
					type="submit"
					styles={{
						padding: "10px 12px",
						fontSize: 16,
						letterSpacing: 0.5,
					}}
				>
					Зарегистрироваться
				</Button>
			</form>
		</Fragment>
	);
};

export default SignUpForm;
