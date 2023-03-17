type Data = Record<string, string>;

// eslint-disable-next-line import/no-anonymous-default-export
export default (data: Data): Data => {
	const result: Data = {};

	for (let key in data) {
		result[key] = data[key].trim();
	}

	return result;
};
