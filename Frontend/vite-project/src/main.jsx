import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7c3aed", // purple
      dark: "#5b21b6",
      contrastText: "#fff",
    },
    secondary: {
      main: "#22d3ee", // cyan
      contrastText: "#000",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
