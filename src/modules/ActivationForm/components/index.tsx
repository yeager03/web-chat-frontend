import { FC, ReactElement } from "react";
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
			<>
				<CircularProgress />
			</>
		) : null;

	const errorMessage =
		status === "error" ? (
			<>
				<ErrorRoundedIcon sx={{ fontSize: 90, color: "#ff4d4f" }} />
				<Typography>{message}</Typography>
			</>
		) : null;

	const expiredMessage =
		status === "expired" ? (
			<>
				<ErrorRoundedIcon sx={{ fontSize: 90, color: "#ff4d4f" }} />
				<Typography>{message}</Typography>
				<Button
					onClick={() => {
						handleMailAgainClick();
					}}
					styles={{ marginTop: "10px" }}
				>
					Отправить письмо повторно
				</Button>
			</>
		) : null;

	const successMessage =
		status === "success" ? (
			<>
				<CheckCircleRoundedIcon sx={{ fontSize: 90, color: "#52C41A" }} />
				<Typography>{message}</Typography>
				<Button styles={{ marginTop: "10px" }}>
					<Link to="/auth/signin" className={styles["auth__activation-link"]}>
						Войти в аккаунт
					</Link>
				</Button>
			</>
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
