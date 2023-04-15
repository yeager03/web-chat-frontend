import { useRef, useEffect } from "react";

const usePrevious = <T, V>(value: T, dep: V) => {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		ref.current = value;
	}, [dep]);

	return ref.current;
};

export default usePrevious;
