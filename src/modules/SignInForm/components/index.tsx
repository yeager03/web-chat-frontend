import { FC, ReactElement, Fragment, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

// components
import { Form, Input } from "antd";
import Button from "../../../components/Button";
import ShadowWrap from "../../../components/ShadowWrap";

// icons
import { LockOutlined, MailOutlined } from "@ant-design/icons";

// styles
import styles from "./SignInForm.module.scss";

// types
import { FormikTouched, FormikErrors } from "formik/dist/types";
import { SignInValues } from "../containers";

type SignInFormProps = {
	values: SignInValues;
	touched: FormikTouched<SignInValues>;
	errors: FormikErrors<SignInValues>;
	isSubmitting: boolean;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const SignInForm: FC<SignInFormProps> = (props): ReactElement => {
	const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

	return (
		<Fragment>
			<div className={styles["auth__top"]}>
				<h2>Войти в аккаунт</h2>
				<p>Пожалуйста, войдите в свой аккаунт</p>
			</div>
			<ShadowWrap className={styles["auth__form"]}>
				<Form className={styles["form"]} onFinish={handleSubmit}>
					<Form.Item
						name="email"
						validateStatus={!touched["email"] ? "" : errors["email"] ? "error" : "success"}
						help={!touched["email"] ? "" : errors["email"]}
						hasFeedback
						style={{ marginBottom: 30 }}
					>
						<Input
							type="email"
							prefix={<MailOutlined className="site-form-item-icon" style={{ opacity: 0.4 }} />}
							placeholder="Email"
							size="large"
							className={styles["form__input"]}
							value={values["email"]}
							onChange={handleChange}
							onBlur={handleBlur}
							autoComplete="false"
						/>
					</Form.Item>

					<Form.Item
						name="password"
						validateStatus={!touched["password"] ? "" : errors["password"] ? "error" : "success"}
						help={!touched["password"] ? "" : errors["password"]}
						hasFeedback
						style={{ marginBottom: 30 }}
					>
						<Input
							type="password"
							prefix={<LockOutlined className="site-form-item-icon" style={{ opacity: 0.4 }} />}
							placeholder="Пароль"
							size="large"
							className={styles["form__input"]}
							value={values["password"]}
							onChange={handleChange}
							onBlur={handleBlur}
							autoComplete="false"
						/>
					</Form.Item>

					<Button disabled={isSubmitting} type="primary" htmlType="submit" className={styles["form__button"]}>
						Войти в аккаунт
					</Button>

					<Link to="/auth/signup" className={styles["form__link"]}>
						Зарегистрироваться
					</Link>
				</Form>
			</ShadowWrap>
		</Fragment>
	);
};

export default SignInForm;
