import ReactDOM from "react-dom/client";

// Providers
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { StyledEngineProvider } from "@mui/material/styles";
import AudioProvider from "./context/AudioProvider";

// styles
import "./assets/scss/index.scss";

// component
import App from "./App";

// store
import { store } from "./store";

// mui theme
import { THEME } from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ThemeProvider theme={THEME}>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={1}>
          <StyledEngineProvider injectFirst>
            <AudioProvider>
              <App />
            </AudioProvider>
          </StyledEngineProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </ThemeProvider>
);
