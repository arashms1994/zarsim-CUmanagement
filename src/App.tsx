import "./App.css";
import { prefixer } from "stylis";
import theme from "./theme/theme.ts";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { Bounce, ToastContainer } from "react-toastify";
import { CssBaseline, Stack } from "@mui/material";
import AppProvider from "./providers/AppProvider.tsx";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import CUManagement from "./components/CUManagement.tsx";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      width="1100px"
      margin="auto"
    >
      <AppProvider>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CUManagement />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
          </ThemeProvider>
        </CacheProvider>
      </AppProvider>
    </Stack>
  );
}

export default App;
