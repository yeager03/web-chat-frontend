import { FC, ReactElement, useState, ChangeEvent } from "react";

// components
import BaseSideBar from "../components/SideBar";

// utils
import getNotification from "../../../utils/notification";

// services
import UserService from "../../../services/UserService";
import DialogueService from "../../../services/DialogueService";

// types
import UserResponse from "../../../models/response/UserResponse";
import DialogueResponse from "../../../models/response/DialogueResponse";

interface IDialogueState {
	email: string;
	message: string;
}

const SideBar: FC = (): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);

	const [dialogueState, setDialogueState] = useState<IDialogueState>({
		email: "",
		message: "",
	});

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = async () => {
		setLoading(true);
		try {
			const { data } = await UserService.findUserByEmail(dialogueState.email);
			const { user }: UserResponse = data;

			if (user) {
				const { data } = await DialogueService.createDialogue(user._id, dialogueState.message);
				const { status }: DialogueResponse = data;

				if (status === "success") {
					getNotification("Успех", "Сообщение было успешно доставлено", status);
				}

				setIsModalOpen(false);
			}
		} catch (error: any) {
			const { status, message } = error.response.data;

			if (message) {
				getNotification("Ошибка", message, status);
			} else {
				getNotification("Ошибка", "Что-то пошло не так...", status);
			}
		}
		setLoading(false);
	};

	const handleCancel = () => {
		setDialogueState({
			email: "",
			message: "",
		});
		setIsModalOpen(false);
	};

	const handleChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (e.target.tagName === "INPUT") {
			setDialogueState({
				...dialogueState,
				email: e.target.value,
			});
		} else {
			setDialogueState({
				...dialogueState,
				message: e.target.value,
			});
		}
	};

	return (
		<BaseSideBar
			isModalOpen={isModalOpen}
			isLoading={isLoading}
			emailValue={dialogueState.email}
			messageValue={dialogueState.message}
			showModal={showModal}
			handleOk={handleOk}
			handleCancel={handleCancel}
			handleChangeValue={handleChangeValue}
		/>
	);
};

export default SideBar;
