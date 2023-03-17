// date-fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ru from "date-fns/locale/ru";

// eslint-disable-next-line import/no-anonymous-default-export
export default (date: string) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
