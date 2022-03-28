import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { createTheme, ThemeProvider } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBCWbFpLg5cPHPDwHPa1JVqVeAT1N3g77k",
  authDomain: "adventure-hoppers.firebaseapp.com",
  projectId: "adventure-hoppers",
  storageBucket: "adventure-hoppers.appspot.com",
  messagingSenderId: "74234856359",
  appId: "1:74234856359:web:dc3d39882c9be3f193ac82",
  measurementId: "G-VY1F9GJ8S3",
};

export const app = initializeApp(firebaseConfig);

function MyApp({ Component, pageProps }) {
  const [analytics, setAnalytics] = useState();
  useEffect(() => {
    isSupported()
      .then(() => {
        console.log("initializing analytics");
        setAnalytics(getAnalytics(app));
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

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
        <Component {...pageProps} analytics={analytics} />
      </ThemeProvider>
    </MoralisProvider>
  );
}

export default MyApp;
