import { FC, ReactElement, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
	const [activationState, setActivationState] = useState<IActivationState>({
		status: "loading",
		message: "",
		email: null,
	});
	const { id } = useParams();

	useEffect(() => {
		if (id) {
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
	}, []);

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
