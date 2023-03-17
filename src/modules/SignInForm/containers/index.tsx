import { FC, ReactElement } from "react";
import { useAppDispatch } from "../../../store";

// components
import BaseSignInForm from "../components";

// formik
import { useFormik } from "formik";

// utils
import getTrimmedFields from "../../../utils/trimFields";

// patterns
import getPatterns from "../../../utils/validationPatterns";

// hooks
import useAuth from "../../../hooks/useAuth";

// actions
import { signIn } from "../../../store/slices/user/authActions";

export type SignInValues = {
	email: string;
	password: string;
};

const SignInForm: FC = (): ReactElement => {
	const { status } = useAuth();
	const dispatch = useAppDispatch();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		} as SignInValues,
		validate: (values: SignInValues) => {
			const errors: Record<string, string> = {};
			const data = getTrimmedFields(values) as SignInValues;
			const { email } = getPatterns();

			if (data["email"] === "") {
				errors["email"] = "Введите почту";
			} else if (!email.test(data["email"])) {
				errors["email"] = "Введите корректный email адрес";
			}

			if (data["password"] === "") {
				errors["password"] = "Введите пароль";
			}

			return errors;
		},
		onSubmit: (values) => {
			const data = getTrimmedFields(values) as SignInValues;
			dispatch(signIn(data));
		},
	});

	return (
		<BaseSignInForm
			values={formik.values}
			touched={formik.touched}
			errors={formik.errors}
			isSubmitting={status === "loading" ? true : false}
			handleChange={formik.handleChange}
			handleBlur={formik.handleBlur}
			handleSubmit={formik.handleSubmit}
		/>
	);
};

export default SignInForm;
