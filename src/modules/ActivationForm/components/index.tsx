import { FC, ReactElement, Fragment } from "react";
import { Link } from "react-router-dom";

// mui components
import { Typography, Box, CircularProgress } from "@mui/material";

// mui icons
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// component
import Button from "../../../components/Button";

// styles
import styles from "./ActivationForm.module.scss";

type ActivationFormProps = {
	status: "loading" | "success" | "expired" | "error";
	message: string;
	handleMailAgainClick: () => void;
};

const ActivationForm: FC<ActivationFormProps> = (props): ReactElement => {
	const { status, message, handleMailAgainClick } = props;

	const loadingMessage =
		status === "loading" ? (
			<Fragment>
				<CircularProgress />
			</Fragment>
		) : null;

	const errorMessage =
		status === "error" ? (
			<Fragment>
				<ErrorRoundedIcon sx={{ fontSize: 90, color: "#ff4d4f" }} />
				<Typography>{message}</Typography>
			</Fragment>
		) : null;

	const expiredMessage =
		status === "expired" ? (
			<Fragment>
				<ErrorRoundedIcon sx={{ fontSize: 90, color: "#ff4d4f" }} />
				<Typography>{message}</Typography>
				<Button
					onClick={() => {
						console.log(1);
						handleMailAgainClick();
					}}
					styles={{ marginTop: "10px" }}
				>
					Отправить письмо повторно
				</Button>
			</Fragment>
		) : null;

	const successMessage =
		status === "success" ? (
			<Fragment>
				<CheckCircleRoundedIcon sx={{ fontSize: 90, color: "#52C41A" }} />
				<Typography>{message}</Typography>
				<Link to="/auth/signin" className={styles["auth__activation-link"]}>
					Войти в аккаунт
				</Link>
			</Fragment>
		) : null;

	return (
		<Box className={styles["auth__activation"]}>
			{loadingMessage}
			{errorMessage}
			{expiredMessage}
			{successMessage}
		</Box>
	);
};

export default ActivationForm;
