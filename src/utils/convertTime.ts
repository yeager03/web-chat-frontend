// eslint-disable-next-line import/no-anonymous-default-export
export default (time: number) => {
	const min = Math.floor(time / 60),
		sec = +(time % 60).toFixed();

	return `${min < 10 ? 0 : ""}${min}:${sec < 10 ? 0 : ""}${sec}`;
};
