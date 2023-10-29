// usage <Theme></Theme>

import {
	ThemeProvider,
	createTheme,
} from "@mui/material";

const theme = createTheme({
	palette: {
		primary: {
			main: "#D9D9D9",
		}
	},
});

function Theme(props: any) {
	return (
		<ThemeProvider theme={theme}>
			{props.children}
		</ThemeProvider>
	)
}

export default Theme;