// date-fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ru from "date-fns/locale/ru";

const getMessageDate = (date: string) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });

export default getMessageDate;
