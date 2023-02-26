import { FC, ReactElement, ReactNode } from "react";

// classnames
import cn from "classnames";

// style
import styles from "./ShadowWrap.module.scss";

type ShadowWrapProps = {
	children: ReactNode;
	className?: string;
};

const ShadowWrap: FC<ShadowWrapProps> = (props): ReactElement => {
	const { children, className } = props;

	return <div className={cn(styles["shadow-wrap"], className)}>{children}</div>;
};

export default ShadowWrap;
