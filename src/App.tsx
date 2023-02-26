import { FC, ReactElement } from "react";
import { Routes, Route } from "react-router-dom";

// layout
import Layout from "./layout";

// pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// modules
import SignInForm from "./modules/SignInForm";
import SignUpForm from "./modules/SignUpForm";

const App: FC = (): ReactElement => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />

				<Route path="auth/*" element={<Auth />}>
					<Route path="signin" element={<SignInForm />} />
					<Route path="signup" element={<SignUpForm />} />
				</Route>
			</Route>
		</Routes>
	);
};
export default App;
