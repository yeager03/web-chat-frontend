import { FC, ReactElement, useState } from "react";

// components
import BaseFriends from "../components/Friends";
import FriendModal from "../components/FriendModal";

// utils
import getNotification from "../../../utils/notification";

// services
import UserService from "../../../services/UserService";

// types
import UserResponse from "../../../models/response/UserResponse";

// formik
import { useFormik } from "formik";

// patterns
import getPatterns from "../../../utils/validationPatterns";

// hooks
import useAuth from "../../../hooks/useAuth";

export type FriendModalValues = {
	email: string;
};

const Friends: FC = (): ReactElement => {
	const [isModalOpen, setModalOpen] = useState<boolean>(false);

	const { user } = useAuth();

	const showModal = () => setModalOpen(true);

	const formik = useFormik({
		initialValues: {
			email: "",
		} as FriendModalValues,
		validate: (values: FriendModalValues) => {
			const errors: Record<string, string> = {};
			const value = values["email"].trim();
			const { email } = getPatterns();

			if (value === "") {
				errors["email"] = "Введите почту";
			} else if (!email.test(value)) {
				errors["email"] = "Введите корректный email адрес";
			} else if (user && value === user.email) {
				errors["email"] = "Вы не можете отправить заявку самому себе";
			}

			return errors;
		},
		onSubmit: async (values, { setSubmitting }) => {
			const email = values["email"].trim();

			setSubmitting(true);

			try {
				const { data } = await UserService.findUserByEmail(email);
				const { user: recipient }: UserResponse = data;

				if (recipient) {
					const { data } = await UserService.friendRequest(recipient._id);
					const { status, message }: UserResponse = data;

					if (status === "success") {
						getNotification(message, status);
					}

					setModalOpen(false);
				}
			} catch (error: any) {
				const { message, status } = error.response.data;

				getNotification(message, status);
			} finally {
				setSubmitting(false);
			}
		},
	});

	const handleCancel = () => {
		setModalOpen(false);

		formik.values.email = "";
		delete formik.touched.email;
		delete formik.errors.email;
	};

	return (
		<>
			<BaseFriends
				// modal
				isModalOpen={isModalOpen}
				showModal={showModal}
			/>
			<FriendModal
				isModalOpen={isModalOpen}
				isSubmitting={formik.isSubmitting}
				values={formik.values}
				touched={formik.touched}
				errors={formik.errors}
				handleChange={formik.handleChange}
				handleBlur={formik.handleBlur}
				handleCancel={handleCancel}
				handleOk={formik.handleSubmit}
			/>
		</>
	);
};

export default Friends;
