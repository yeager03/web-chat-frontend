import createTheme from "@mui/material/styles/createTheme";

export const THEME = createTheme({
	typography: {
		fontFamily: "'Nunito', sans-serif;",
		fontSize: 14,

		button: {
			fontWeight: 600,
			textTransform: "initial",
		},
	},
});
