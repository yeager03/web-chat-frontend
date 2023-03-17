import { FC, ReactElement } from "react";
import { Outlet, Navigate } from "react-router-dom";

// hook
import useAuth from "../hooks/useAuth";

const PrivateLayout: FC = (): ReactElement => {
	const { isAuth } = useAuth();

	if (!isAuth) {
		return <Navigate to={"auth/signin"} replace />;
	}

	return <Outlet />;
};

export default PrivateLayout;
