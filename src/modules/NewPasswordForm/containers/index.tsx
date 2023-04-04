import { FC, ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";

// components
import BaseNewPasswordForm from "../components";

// formik
import { useFormik } from "formik";

// utils
import getTrimmedFields from "../../../utils/trimFields";

// patterns
import getPatterns from "../../../utils/validationPatterns";

// services
import AuthService from "../../../services/AuthService";

// notification
import getNotification from "../../../utils/notification";

export type NewPasswordFormValues = {
	password: string;
	confirmPassword: string;
};

export interface INewPasswordState {
	status: "loading" | "success" | "expired" | "error";
	message: string;
}

const NewPasswordForm: FC = (): ReactElement => {
	const [isValidUrl, setValidUrl] = useState<boolean>(true);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [newPasswordState, setNewPasswordState] = useState<INewPasswordState>({
		status: "loading",
		message: "",
	});

	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)) {
				setValidUrl(false);
			} else {
				AuthService.newPassword(id)
					.then(({ data }) => {
						setNewPasswordState({
							...newPasswordState,
							...(data as INewPasswordState),
						});
					})
					.catch((error) => {
						const { response } = error;
						setNewPasswordState(response.data);
					});
			}
		} else {
			setValidUrl(false);
		}
	}, []);

	const formik = useFormik({
		initialValues: {
			password: "",
			confirmPassword: "",
		} as NewPasswordFormValues,
		validate: (values: NewPasswordFormValues) => {
			const errors: Record<string, string> = {};
			const data = getTrimmedFields(values) as NewPasswordFormValues;
			const { password } = getPatterns();

			if (data["password"] === "") {
				errors["password"] = "Введите пароль";
			} else if (!password.test(data["password"])) {
				errors["password"] = "Слишком легкий пароль";
			}

			if (data["confirmPassword"] === "") {
				errors["confirmPassword"] = "Введите повторно пароль";
			} else if (data["password"] !== data["confirmPassword"]) {
				errors["confirmPassword"] = "Пароли не совпадают";
			}

			return errors;
		},
		onSubmit: (values, { setSubmitting }) => {
			if (id) {
				const password = values["password"].trim();

				setSubmitting(true);

				AuthService.newPassword(id, password)
					.then(({ data }) => {
						const { message, status } = data;

						if (status === "success") {
							getNotification(message, status);

							return navigate("/auth/signin", {
								replace: true,
							});
						}
					})
					.catch(({ response }) => {
						const { status, message } = response.data;

						if (status === "error") {
							getNotification(message, status);
						}
					})
					.finally(() => {
						setSubmitting(false);
					});
			}
		},
	});

	if (!isValidUrl) {
		return <Navigate to={"/auth/signin"} replace />;
	}

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<BaseNewPasswordForm
			newPasswordState={newPasswordState}
			values={formik.values}
			touched={formik.touched}
			errors={formik.errors}
			isSubmitting={false}
			showPassword={showPassword}
			handleChange={formik.handleChange}
			handleBlur={formik.handleBlur}
			handleSubmit={formik.handleSubmit}
			handleClickShowPassword={handleClickShowPassword}
		/>
	);
};

export default NewPasswordForm;
