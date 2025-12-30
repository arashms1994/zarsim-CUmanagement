import "./App.css";
import { prefixer } from "stylis";
import theme from "./theme/theme.ts";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { CssBaseline } from "@mui/material";
import { Bounce, ToastContainer } from "react-toastify";
import AppProvider from "./providers/AppProvider.tsx";
import CUManagement from "./components/CUManagement.tsx";
import { CacheProvider, ThemeProvider } from "@emotion/react";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
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
  );
}

export default App;
