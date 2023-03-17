import { FC, ReactElement, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./store";

// layout
import Layout from "./layout";
import PrivateLayout from "./layout/PrivateLayout";
import PublicLayout from "./layout/PublicLayout";

// pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// modules
import SignInForm from "./modules/SignInForm";
import SignUpForm from "./modules/SignUpForm";

// hooks
import useAuth from "./hooks/useAuth";

// actions
import { checkAuth } from "./store/slices/user/authActions";

const App: FC = (): ReactElement => {
	const { token } = useAuth();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (token) {
			dispatch(checkAuth());
		}
	}, []);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route element={<PrivateLayout />}>
					<Route index element={<Home />} />
					<Route path="dialogue/:dialogueId" element={<Home />} />
				</Route>

				<Route element={<PublicLayout />}>
					<Route path="auth/*" element={<Auth />}>
						<Route path="signin" element={<SignInForm />} />
						<Route path="signup" element={<SignUpForm />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
};
export default App;
