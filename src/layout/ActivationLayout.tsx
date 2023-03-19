import { FC, ReactElement } from "react";
import { Outlet, Navigate, useParams } from "react-router-dom";

const ActivationLayout: FC = (): ReactElement => {
	const { activationId } = useParams();

	if (!activationId) {
		return <Navigate to={"/auth/signin"} replace />;
	}

	if (activationId && !/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(activationId)) {
		return <Navigate to={"/auth/signin"} replace />;
	}

	return <Outlet />;
};

export default ActivationLayout;
