import { FC, ReactElement, Fragment, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

// classnames
import cn from "classnames";

// components
import { Form, Input } from "antd";
import Button from "../../../components/Button";
import ShadowWrap from "../../../components/ShadowWrap";

// icons
import { MailOutlined, UserOutlined, LockOutlined, InfoCircleTwoTone } from "@ant-design/icons";

// styles
import styles from "./SignUpForm.module.scss";

// types
import { FormikTouched, FormikErrors } from "formik/dist/types";
import { SignUpValues } from "../containers";

type SignUpFormProps = {
	values: SignUpValues;
	touched: FormikTouched<SignUpValues>;
	errors: FormikErrors<SignUpValues>;
	isValid: boolean;
	isSubmitting: boolean;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const SignUpForm: FC<SignUpFormProps> = (props): ReactElement => {
	const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

	const success = false;

	return (
		<Fragment>
			<div className={styles["auth__top"]}>
				<h2>Регистрация</h2>
				<p>Для входа в чат, вам нужно зарегистрироваться</p>
			</div>

			<ShadowWrap
				className={success ? cn(styles["auth__form"], styles["auth__form_success"]) : styles["auth__form"]}
			>
				{!success ? (
					<Form className={styles["form"]} onFinish={handleSubmit} initialValues={values}>
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
							/>
						</Form.Item>

						<Form.Item
							name="fullName"
							validateStatus={!touched["fullName"] ? "" : errors["fullName"] ? "error" : "success"}
							help={!touched["fullName"] ? "" : errors["fullName"]}
							hasFeedback
							style={{ marginBottom: 30 }}
						>
							<Input
								type="text"
								prefix={<UserOutlined className="site-form-item-icon" style={{ opacity: 0.4 }} />}
								placeholder="Полное имя"
								size="large"
								className={styles["form__input"]}
								value={values["fullName"]}
								onChange={handleChange}
								onBlur={handleBlur}
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
							/>
						</Form.Item>

						<Form.Item
							name="confirmPassword"
							validateStatus={!touched["confirmPassword"] ? "" : errors["confirmPassword"] ? "error" : "success"}
							help={!touched["confirmPassword"] ? "" : errors["confirmPassword"]}
							hasFeedback
							style={{ marginBottom: 30 }}
						>
							<Input
								type="password"
								prefix={<LockOutlined className="site-form-item-icon" style={{ opacity: 0.4 }} />}
								placeholder="Повторите пароль"
								size="large"
								className={styles["form__input"]}
								value={values["confirmPassword"]}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Form.Item>

						<Button disabled={isSubmitting} type="primary" htmlType="submit" className={styles["form__button"]}>
							Зарегистрироваться
						</Button>

						<Link to="/auth/signin" className={styles["form__link"]}>
							Войти в аккаунт
						</Link>
					</Form>
				) : (
					<Fragment>
						<InfoCircleTwoTone style={{ fontSize: "50px" }} />
						<h2>Подтвердите свой аккаунт</h2>
						<p>На вашу почту было отправлено письмо с ссылкой на подтверждение аккаунта.</p>
					</Fragment>
				)}
			</ShadowWrap>
		</Fragment>
	);
};

export default SignUpForm;
