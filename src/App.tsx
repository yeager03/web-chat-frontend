import { FC, ReactElement, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./store";

// layout
import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";

// pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// modules
import SignInForm from "./modules/SignInForm";
import SignUpForm from "./modules/SignUpForm";
import ActivationForm from "./modules/ActivationForm";
import ResetForm from "./modules/ResetForm";
import Dialogues from "./modules/Dialogues";
import Friends from "./modules/Friends";
import Profile from "./modules/Profile";

// hooks
import useAuth from "./hooks/useAuth";

// actions
import { checkAuth } from "./store/slices/user/authActions";
import NewPasswordForm from "./modules/NewPasswordForm";

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
      <Route element={<HomeLayout />}>
        <Route path="/*" element={<Home />}>
          <Route element={<Navigate to="/dialogues" replace />} index />

          <Route path="dialogues/:dialogueId?" element={<Dialogues />} />
          <Route path="friends" element={<Friends />} />
          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<h1>Not found 404</h1>} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="auth/*" element={<Auth />}>
          <Route path="signin" element={<SignInForm />} />
          <Route path="signup" element={<SignUpForm />} />

          <Route path="activate/:id" element={<ActivationForm />} />

          <Route path="password/reset" element={<ResetForm />} />
          <Route path="password/new/:id" element={<NewPasswordForm />} />

          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
