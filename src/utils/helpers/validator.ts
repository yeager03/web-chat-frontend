// eslint-disable-next-line import/no-anonymous-default-export
export default (values: Record<string, string>, isAuth: boolean = false) => {
	const errors: Record<string, string> = {};

	if (values["email"] === "") {
		errors["email"] = "Введите почту";
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values["email"])) {
		errors["email"] = "Введите корректный email адрес";
	}

	if (values["password"] === "") {
		errors["password"] = "Введите пароль";
	} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(values["password"])) {
		errors["password"] = isAuth ? "Не правильный пароль" : "Слишком легкий пароль";
	}

	if (!isAuth) {
		if (values["fullName"] === "") {
			errors["fullName"] = "Введите полное имя";
		} else if (!/^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/.test(values["fullName"])) {
			errors["fullName"] = "Введите корректное полное имя";
		}

		if (values["confirmPassword"] === "") {
			errors["confirmPassword"] = "Введите повторно пароль";
		} else if (values["password"] !== values["confirmPassword"]) {
			errors["confirmPassword"] = "Пароли не совпадают";
		}
	}

	return errors;
};
