import { FC, ReactElement, ReactNode, DetailedHTMLProps, ButtonHTMLAttributes } from "react";

// component
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";

type ButtonProps = {
	children: ReactNode;
	disabled?: boolean;
	loading?: boolean;
	styles?: object;
	size?: "large" | "small" | "medium";
	type?: "button" | "submit" | "reset";
} & LoadingButtonProps;

const baseSxStyles = {
	backgroundColor: "#212b36",
	color: "#fff",
	"&:hover": {
		backgroundColor: "#212b36",
		color: "#fff",
	},
};

const Button: FC<ButtonProps> = (props): ReactElement => {
	const { disabled, loading, children, size, type, styles } = props;

	return (
		<LoadingButton
			disabled={disabled}
			loading={loading}
			type={type ? type : "button"}
			variant="contained"
			size={size ? size : "large"}
			sx={{ ...baseSxStyles, ...styles }}
			{...props}
		>
			{children}
		</LoadingButton>
	);
};

export default Button;
