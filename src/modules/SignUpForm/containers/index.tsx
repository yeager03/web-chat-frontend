import { FC, ReactElement } from "react";
import { useAppDispatch } from "../../../store";

// components
import BaseSignUpForm from "../components";

// formik
import { useFormik } from "formik";

// utils
import getTrimmedFields from "../../../utils/trimFields";

// patterns
import getPatterns from "../../../utils/validationPatterns";

// hooks
import useAuth from "../../../hooks/useAuth";

// actions
import { signUp } from "../../../store/slices/user/authActions";

export type SignUpValues = {
	email: string;
	fullName: string;
	password: string;
	confirmPassword: string;
};

const SignInForm: FC = (): ReactElement => {
	const { status } = useAuth();
	const dispatch = useAppDispatch();

	const formik = useFormik({
		initialValues: {
			email: "",
			fullName: "",
			password: "",
			confirmPassword: "",
		} as SignUpValues,
		validate: (values: SignUpValues) => {
			const errors: Record<string, string> = {};
			const data = getTrimmedFields(values) as SignUpValues;
			const { email, fullName, password } = getPatterns();

			if (data["email"] === "") {
				errors["email"] = "Введите email адрес";
			} else if (!email.test(data["email"])) {
				errors["email"] = "Введите корректный email адрес";
			}

			if (data["fullName"] === "") {
				errors["fullName"] = "Введите полное имя";
			} else if (!fullName.test(data["fullName"])) {
				errors["fullName"] = "Введите корректное полное имя";
			}

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
		onSubmit: (values) => {
			const data = getTrimmedFields(values) as SignUpValues;
			dispatch(signUp(data));
		},
	});

	return (
		<BaseSignUpForm
			values={formik.values}
			touched={formik.touched}
			errors={formik.errors}
			isSubmitting={status === "loading" ? true : false}
			success={status === "success" ? true : false}
			handleChange={formik.handleChange}
			handleBlur={formik.handleBlur}
			handleSubmit={formik.handleSubmit}
		/>
	);
};

export default SignInForm;
