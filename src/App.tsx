import { FC, ReactElement, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./store";

// layout
import Layout from "./layout";
import PrivateLayout from "./layout/PrivateLayout";
import PublicLayout from "./layout/PublicLayout";
import ActivationLayout from "./layout/ProtectedLayout";

// pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// modules
import SignInForm from "./modules/SignInForm";
import SignUpForm from "./modules/SignUpForm";
import ActivationForm from "./modules/ActivationForm";
import ResetForm from "./modules/ResetForm";

// hooks
import useAuth from "./hooks/useAuth";

// actions
import { checkAuth } from "./store/slices/user/authActions";
import NewPasswordForm from "./modules/NewPasswordForm";
import ProtectedLayout from "./layout/ProtectedLayout";

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
				{/* <Route element={<PrivateLayout />}>
					<Route index element={<Home />} />
					<Route path="dialogue/:dialogueId" element={<Home />} />
				</Route> */}

				<Route element={<PublicLayout />}>
					<Route path="auth/*" element={<Auth />}>
						<Route path="signin" element={<SignInForm />} />
						<Route path="signup" element={<SignUpForm />} />
						<Route path="activate/*" element={<ProtectedLayout />}>
							<Route path=":id" element={<ActivationForm />} />
						</Route>
						<Route path="password/*">
							<Route path="reset" element={<ResetForm />} />
							<Route path="new/*" element={<ProtectedLayout />}>
								<Route path=":id" element={<NewPasswordForm />} />
							</Route>
						</Route>
					</Route>
				</Route>

				<Route path="*" element={<h1>Not found</h1>} />
			</Route>
		</Routes>
	);
};
export default App;
