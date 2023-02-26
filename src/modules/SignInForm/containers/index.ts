import SignInForm from "../components";

// formik
import { withFormik } from "formik";

// validator
import validator from "../../../utils/helpers/validator";

export type SignInValues = {
	email: string;
	password: string;
};

export default withFormik({
	mapPropsToValues: (): SignInValues => ({
		email: "",
		password: "",
	}),

	validate: (values: SignInValues) => validator(values, true),

	handleSubmit: (values, { setSubmitting }) => {
		setTimeout(() => {
			console.log(values);
			setSubmitting(false);
		}, 1000);
	},

	displayName: "SignInForm",
})(SignInForm);
