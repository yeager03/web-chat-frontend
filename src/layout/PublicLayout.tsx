import { FC, ReactElement } from "react";
import { Outlet, Navigate } from "react-router-dom";

// hook
import useAuth from "../hooks/useAuth";

const PublicLayout: FC = (): ReactElement => {
	const { isAuth } = useAuth();

	if (isAuth) {
		return <Navigate to={"/"} replace />;
	}

	return <Outlet />;
};

export default PublicLayout;
