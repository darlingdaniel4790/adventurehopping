import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { createTheme, ThemeProvider } from "@mui/material";

function MyApp({ Component, pageProps }) {
  const customTheme = createTheme({
    typography: {
      fontFamily: ['"Baloo 2"', "cursive"].join(","),
      button: {
        fontWeight: "bolder",
      },
      h4: {
        fontFamily: ['"Handlee"', "cursive"].join(","),
      },
    },
    palette: {
      primary: {
        main: "#1f6410",
      },
      secondary: {
        main: "#c23767",
      },
    },
  });

  return (
    <MoralisProvider
      appId="lgr6PR27hscCvrVaLU3EWHF4PQnuDyOxmK1eednY"
      serverUrl="https://yysp9eky99pr.usemoralis.com:2053/server"
    >
      <ThemeProvider theme={customTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </MoralisProvider>
  );
}

export default MyApp;
