import { FC, ReactElement, useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

// components
import BaseActivationForm from "../components";

// service
import AuthService from "../../../services/AuthService";

// notification
import getNotification from "../../../utils/notification";

interface IActivationState {
	status: "loading" | "success" | "expired" | "error";
	message: string;
	email: string | null;
}

const ActivationForm: FC = (): ReactElement => {
	const [isValidUrl, setValidUrl] = useState<boolean>(true);
	const [activationState, setActivationState] = useState<IActivationState>({
		status: "loading",
		message: "",
		email: null,
	});
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)) {
				setValidUrl(false);
			} else {
				AuthService.activateAccount(id)
					.then((response) => {
						const { data } = response;
						setActivationState({
							...activationState,
							...(data as IActivationState),
						});
					})
					.catch((error) => {
						const { response } = error;
						setActivationState(response.data);
					});
			}
		} else {
			setValidUrl(false);
		}
	}, []);

	if (!isValidUrl) {
		return <Navigate to={"/auth/signin"} replace />;
	}

	const handleMailAgainClick = () => {
		if (activationState.email) {
			AuthService.againSendActivateMail(activationState.email)
				.then((response) => {
					const { status, message } = response.data;

					if (status === "success") {
						getNotification(message, status);
					}
				})
				.catch(({ response }) => {
					const { status, message } = response.data;
					if (status === "error") {
						getNotification(message, status);
					}
				});
		}
	};

	return <BaseActivationForm {...activationState} handleMailAgainClick={handleMailAgainClick} />;
};

export default ActivationForm;
