import { FC, ReactElement } from "react";
import { Outlet } from "react-router-dom";

// style
import styles from "./Auth.module.scss";

const Auth: FC = (): ReactElement => {
	return (
		<section className={styles["auth"]}>
			<div className={styles["auth__wrapper"]}>
				<Outlet />
			</div>
		</section>
	);
};

export default Auth;
