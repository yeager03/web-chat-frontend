// antds components
import { notification } from "antd";

// eslint-disable-next-line import/no-anonymous-default-export
export default (title: string, description: string, type: string = "info", duration: number = 3) => {
	if (type === "success" || type === "error") {
		return notification[type]({ message: title, description, duration });
	}

	return notification["info"]({ message: title, description, duration });
};
