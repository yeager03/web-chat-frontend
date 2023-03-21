import { FC, ReactElement } from "react";

// components
import BaseResetForm from "../components";

// formik
import { useFormik } from "formik";

// patterns
import getPatterns from "../../../utils/validationPatterns";

// notification
import getNotification from "../../../utils/notification";

// service
import AuthService from "../../../services/AuthService";

export type ResetValues = {
	email: string;
};

const ResetForm: FC = (): ReactElement => {
	const formik = useFormik({
		initialValues: {
			email: "",
		} as ResetValues,
		validate: (values: ResetValues) => {
			const errors: Record<string, string> = {};
			const value = values["email"].trim();
			const { email } = getPatterns();

			if (value === "") {
				errors["email"] = "Введите почту";
			} else if (!email.test(value)) {
				errors["email"] = "Введите корректный email адрес";
			}

			return errors;
		},
		onSubmit: (values, { setSubmitting }) => {
			const email = values["email"].trim();
			setSubmitting(true);

			AuthService.resetPassword(email)
				.then(({ data }) => {
					const { message, status } = data;

					if (status === "success") {
						getNotification(message, status);
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
		},
	});

	return (
		<BaseResetForm
			values={formik.values}
			touched={formik.touched}
			errors={formik.errors}
			isSubmitting={formik.isSubmitting}
			handleChange={formik.handleChange}
			handleBlur={formik.handleBlur}
			handleSubmit={formik.handleSubmit}
		/>
	);
};

export default ResetForm;
