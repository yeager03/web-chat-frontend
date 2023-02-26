// date-fns
import format from "date-fns/format";
import ru from "date-fns/locale/ru";
import isToday from "date-fns/isToday";

const getDialogueDate = (created_at: string) => {
	const date = new Date(created_at);

	if (isToday(date)) {
		return format(date, "HH:mm");
	}

	return format(date, "dd MMM yyyy", {
		locale: ru,
	});
};

export default getDialogueDate;
