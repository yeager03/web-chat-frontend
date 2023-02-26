import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

// styles
import "./assets/scss/index.scss";

// component
import App from "./App";

// store
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);
