import { createTheme, type ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  direction: "rtl",
  typography: {
    fontFamily: '"Vazir", "sans-serif"',
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1e7677",
    },
    secondary: {
      main: "#1e7677",
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
