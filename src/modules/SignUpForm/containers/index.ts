import SignUpForm from "../components";

// formik
import { withFormik } from "formik";

// validator
import validator from "../../../utils/helpers/validator";

export type SignUpValues = {
	email: string;
	fullName: string;
	password: string;
	confirmPassword: string;
};

export default withFormik({
	mapPropsToValues: (): SignUpValues => ({
		email: "",
		fullName: "",
		password: "",
		confirmPassword: "",
	}),

	validate: (values: SignUpValues) => validator(values),

	handleSubmit: (values, { setSubmitting }) => {
		setTimeout(() => {
			console.log(values);
			setSubmitting(false);
		}, 1000);
	},

	displayName: "SignUpForm",
})(SignUpForm);
