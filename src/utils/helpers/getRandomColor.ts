// tinycolor2
import tinycolor2 from "tinycolor2";

type RandomColor = {
	color: string;
	lighten: string;
};

const randomColors = [
	"#109e5b",
	"#0558b0",
	"#ded600",
	"#b504cc",
	"#d6020d",
	"#00ff3c",
	"#0040ff",
	"#ff9500",
	"#ffbf00",
	"#00c3ff",
	"#693466",
	"#ff3700",
	"#fd4bd0",
	"#682c7d",
];

const getRandomColor = (): RandomColor => {
	const color = randomColors[Math.floor(Math.random() * randomColors.length)];
	return {
		color: tinycolor2(color).darken(20).toHexString(),
		lighten: tinycolor2(color).toHexString(),
	};
};

export default getRandomColor;
