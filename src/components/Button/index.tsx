import { FC, ReactElement } from "react";

// classnames
import cn from "classnames";

// style
import styles from "./Button.module.scss";

// component
import { Button as BaseButton, ButtonProps } from "antd";

const Button: FC<
	ButtonProps & {
		className?: string;
		disabled?: boolean;
	}
> = (props): ReactElement => {
	const { className } = props;

	return <BaseButton {...props} className={cn(styles["button"], className)} />;
};

export default Button;
