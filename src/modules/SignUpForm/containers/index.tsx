import { FC, ReactElement, useState } from "react";
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
  name: string;
  surname: string;
  email: string;
  password: string;
};

const SignInForm: FC = (): ReactElement => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { status } = useAuth();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
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

      if (data["name"] === "") {
        errors["name"] = "Введите ваше имя";
      } else if (!fullName.test(data["name"])) {
        errors["name"] = "Введите корректное имя";
      }

      if (data["surname"] === "") {
        errors["surname"] = "Введите вашу фамилию";
      } else if (!fullName.test(data["surname"])) {
        errors["surname"] = "Введите корректную фамилию";
      }

      if (data["password"] === "") {
        errors["password"] = "Введите пароль";
      } else if (!password.test(data["password"])) {
        errors["password"] = "Слишком легкий пароль";
      }

      return errors;
    },
    onSubmit: (values) => {
      const data = getTrimmedFields(values) as SignUpValues;
      dispatch(
        signUp({
          email: data["email"],
          fullName: `${data["name"]} ${data["surname"]}`,
          password: data["password"],
        })
      );
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <BaseSignUpForm
      values={formik.values}
      touched={formik.touched}
      errors={formik.errors}
      showPassword={showPassword}
      isSubmitting={status === "loading" ? true : false}
      success={status === "success" ? true : false}
      handleChange={formik.handleChange}
      handleBlur={formik.handleBlur}
      handleSubmit={formik.handleSubmit}
      handleClickShowPassword={handleClickShowPassword}
    />
  );
};
export default SignInForm;
