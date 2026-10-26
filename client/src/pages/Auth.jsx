import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { setCredentials } from "../store/authSlice";
export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const googleSuccess = async (credentialResponse) => {
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      dispatch(setCredentials(data));
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Google sign-in failed. Check OAuth configuration.",
      );
    } finally {
      setBusy(false);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post(
        `/auth/${isRegister ? "register" : "login"}`,
        form,
      );
      dispatch(setCredentials(data));
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to API. Is the backend running?",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-aside">
        <Link to="/" className="brand text-white">
          <span className="brand-icon">
            <BookOpen size={20} />
          </span>
          up<span>Skill</span>
        </Link>
        <div className="auth-aside-copy">
          <div className="section-kicker">YOUR NEXT CHAPTER</div>
          <h1>
            {isRegister ? "Make room for" : "Keep moving"}
            <br />
            <span>{isRegister ? "what’s next." : "what’s possible."}</span>
          </h1>
          <p>
            A little learning can change a lot. Build your next skill, one
            lesson at a time.
          </p>
          <div className="auth-benefit">
            <span>
              <BookOpen size={18} />
            </span>{" "}
            Learn practical skills
          </div>
          <div className="auth-benefit">
            <span>
              <LockKeyhole size={18} />
            </span>{" "}
            Your progress stays yours
          </div>
        </div>
        <div className="auth-aside-bottom">Curiosity looks good on you.</div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <Link to="/" className="brand">
              <span className="brand-icon">
                <BookOpen size={20} />
              </span>
              up<span>Skill</span>
            </Link>
          </div>
          <div className="auth-heading">
            <div className="section-kicker">
              WELCOME {isRegister ? "ABOARD" : "BACK"}
            </div>
            <h2>{isRegister ? "Create your account" : "Sign in to upSkill"}</h2>
            <p>
              {isRegister
                ? "Start your learning journey today."
                : "Pick up where you left off."}
            </p>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={submit} className="auth-form">
            {isRegister && (
              <label>
                Full name
                <div className="input-icon">
                  <UserRound size={18} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Your name"
                    required
                    minLength={2}
                  />
                </div>
              </label>
            )}
            <label>
              Email address
              <div className="input-icon">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </label>
            <label>
              Password
              <div className="input-icon">
                <LockKeyhole size={18} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={change}
                  placeholder={
                    isRegister ? "At least 8 characters" : "Enter your password"
                  }
                  required
                  minLength={isRegister ? 8 : 1}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                />
              </div>
            </label>
            {isRegister && (
              <p className="form-legal">
                By creating an account, you agree to use the platform
                respectfully and share only content you have rights to.
              </p>
            )}
            <button className="btn btn-purple btn-lg w-100" disabled={busy}>
              {busy ? "Please wait…" : isRegister ? "Create account" : "Log in"}{" "}
              <ArrowRight size={17} />
            </button>
          </form>
          {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div className="google-login-wrap">
              <div className="or-divider">
                <span>or continue with</span>
              </div>
              <GoogleLogin
                onSuccess={googleSuccess}
                onError={() =>
                  setError("Google sign-in was cancelled or failed.")
                }
                theme="outline"
                shape="rectangular"
                width="100%"
              />
            </div>
          )}
          <div className="auth-switch">
            {isRegister ? "Already learning with us?" : "New to upSkill?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Log in" : "Create an account"}
            </Link>
          </div>
          <div className="auth-security">
            <LockKeyhole size={14} /> Secure sign-in powered by upSkill
          </div>
          <p className="auth-note">
            Google OAuth appears after configuring your Google client ID.
            Payment and instructor tools require server configuration.
          </p>
        </div>
      </div>
    </main>
  );
}
