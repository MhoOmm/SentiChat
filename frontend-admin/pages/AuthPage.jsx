import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

/* ------------------------------------------------------------------
   API base
------------------------------------------------------------------ */
const API = axios.create({ baseURL: "http://localhost:5000/api" });

/* ------------------------------------------------------------------
   DiceBear helpers
------------------------------------------------------------------ */
const DICEBEAR_STYLE = "adventurer";
const DICEBEAR_BASE = `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/svg`;

const avatarUrl = (seed) =>
  `${DICEBEAR_BASE}?seed=${encodeURIComponent(seed)}&backgroundColor=#000000`;

const randomSeed = () => Math.random().toString(36).slice(2, 10);
const makeSeedBatch = () => Array.from({ length: 6 }, randomSeed);

/* ------------------------------------------------------------------
   Animation variants
------------------------------------------------------------------ */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 28 : -28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -28 : 28, opacity: 0 }),
};

const fadeVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

/* ------------------------------------------------------------------
   Reusable Field
------------------------------------------------------------------ */
const Field = ({ id, label, name, type = "text", placeholder, value, onChange }) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block mb-1.5 text-[0.72rem] font-medium tracking-widest uppercase text-gray-400"
    >
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={type === "password" ? "current-password" : name}
      className="
        w-full px-4 py-2.5 rounded-lg text-sm text-brand
        border border-gray-200 bg-white outline-none
        placeholder:text-gray-300
        focus:border-brand focus:ring-2 focus:ring-brand/[0.08]
        transition-all duration-150
      "
    />
  </div>
);

/* ------------------------------------------------------------------
   OTP Input — 6 individual boxes
------------------------------------------------------------------ */
function OTPInput({ value, onChange }) {
  const inputsRef = useRef([]);
  const digits = value.split("");

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[idx]) {
        next[idx] = "";
      } else if (idx > 0) {
        next[idx - 1] = "";
        inputsRef.current[idx - 1]?.focus();
      }
      onChange(next.join(""));
      return;
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleChange = (e, idx) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;
    // Support paste: fill from current index
    const chars = raw.slice(0, 6 - idx).split("");
    const next = [...digits];
    chars.forEach((c, i) => { next[idx + i] = c; });
    onChange(next.join("").slice(0, 6));
    const focusIdx = Math.min(idx + chars.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center my-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          id={`otp-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKey(e, idx)}
          onFocus={(e) => e.target.select()}
          className="
            w-11 h-12 text-center text-lg font-bold text-brand
            border-2 rounded-xl outline-none
            transition-all duration-150
            border-gray-200 bg-white
            focus:border-brand focus:ring-2 focus:ring-brand/[0.08]
            [appearance:textfield]
          "
        />
      ))}
    </div>
  );
}

/* ==================================================================
   AuthPage
================================================================== */
export default function AuthPage() {
  const navigate = useNavigate();

  // "login" | "signup"
  const [tab, setTab] = useState("login");
  const [dir, setDir] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // stage: "form" (login/signup) | "otp"
  const [stage, setStage] = useState("form");
  // userName saved after signup to pass to OTP verify
  const [pendingUser, setPendingUser] = useState("");

  /* ── Login form ── */
  const [loginForm, setLoginForm] = useState({ userName: "", password: "" });

  /* ── Signup form ── */
  const [signupForm, setSignupForm] = useState({
    userName: "", email: "", password: "", confirmPassword: "", avatar: "",
  });

  /* ── OTP ── */
  const [otp, setOtp] = useState("");
  const [otpResent, setOtpResent] = useState(false);

  /* ── Avatar picker ── */
  const [avatarSeeds, setAvatarSeeds] = useState(() => makeSeedBatch());
  const [avatarLoaded, setAvatarLoaded] = useState({});

  const refreshAvatars = useCallback(() => {
    setAvatarSeeds(makeSeedBatch());
    setAvatarLoaded({});
    setSignupForm((p) => ({ ...p, avatar: "" }));
  }, []);

  const selectAvatar = (seed) =>
    setSignupForm((p) => ({ ...p, avatar: seed }));

  /* ── Tab switcher ── */
  const switchTab = (next) => {
    if (next === tab) return;
    setDir(next === "signup" ? 1 : -1);
    setError("");
    setTab(next);
  };

  /* ── Auto-focus first OTP box when OTP stage appears ── */
  useEffect(() => {
    if (stage === "otp") {
      // slight delay so AnimatePresence transition has begun
      const t = setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 250);
      return () => clearTimeout(t);
    }
  }, [stage]);

  /* ---------- change handlers ---------- */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((p) => ({ ...p, [name]: value }));
  };

  const handleSignupChange = (e) =>
    setSignupForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ---------- submit: LOGIN ---------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginForm.userName || !loginForm.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/user/login", {
        userName: loginForm.userName,
        password: loginForm.password,
      });
      // Store token / user as needed
      if (data?.token) localStorage.setItem("token", data.token);
      navigate("/community");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- submit: SIGNUP ---------- */
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!signupForm.avatar) { setError("Please choose an avatar."); return; }
    if (!signupForm.userName || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setError("Please fill in all fields."); return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    setLoading(true);
    try {
      await API.post("/user/signup", {
        userName: signupForm.userName,
        email: signupForm.email,
        password: signupForm.password,
        confirmPassword: signupForm.confirmPassword,
        avatar: avatarUrl(signupForm.avatar),
      });
      setPendingUser(signupForm.userName);
      setOtp("");
      setOtpResent(false);
      setStage("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- submit: OTP VERIFY ---------- */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) { setError("Please enter the 6-digit OTP."); return; }
    setLoading(true);
    try {
      const { data } = await API.post("/user/otp-verify", {
        userName: pendingUser,
        otp: Number(otp),
      });
      if (data?.token) localStorage.setItem("token", data.token);
      // Go to login with success feel
      setStage("form");
      setTab("login");
      setDir(-1);
      setSignupForm({ userName: "", email: "", password: "", confirmPassword: "", avatar: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Resend OTP (re-hit signup with same data or dedicated endpoint) ---------- */
  const handleResendOtp = async () => {
    setError("");
    setOtpResent(false);
    setLoading(true);
    try {
      await API.post("/user/signup", {
        userName: signupForm.userName,
        email: signupForm.email,
        password: signupForm.password,
        confirmPassword: signupForm.confirmPassword,
        avatar: avatarUrl(signupForm.avatar),
      });
      setOtp("");
      setOtpResent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ================================================================
     RENDER
  ================================================================ */
  return (
    <div className="min-h-screen flex font-sans">

      {/* ══════════ Left Panel ══════════ */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-start px-20 py-16 bg-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full border border-white/[0.06] pointer-events-none" />
        <div className="absolute -bottom-14 left-[20px] w-[340px] h-[340px] rounded-full border border-white/[0.04] pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-16">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
          <span className="text-[0.95rem] font-semibold tracking-[0.14em] uppercase text-white">
            SentiChat
          </span>
        </div>

        <h1 className="text-[2.8rem] font-bold leading-[1.12] text-white mb-4">
          Smart insights,<br />
          <span className="text-white/30">real conversations.</span>
        </h1>

        <p className="text-[0.95rem] text-white/40 font-light leading-relaxed max-w-sm">
          Monitor sentiment, analyse trends, and manage your admin panel — all in one clean dashboard.
        </p>
      </div>

      {/* ══════════ Right Panel ══════════ */}
      <div className="w-full lg:w-[480px] min-h-screen bg-white flex flex-col justify-center px-10 py-12 sm:px-14 overflow-y-auto">

        <AnimatePresence mode="wait" custom={dir}>

          {/* ════════════════ OTP SCREEN ════════════════ */}
          {stage === "otp" && (
            <motion.div
              key="otp"
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* Back button */}
              <button
                onClick={() => { setStage("form"); setError(""); }}
                className="flex items-center gap-1.5 text-[0.78rem] text-gray-400 hover:text-brand transition-colors mb-8 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to sign up
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-brand/[0.07] flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-brand mb-1">Check your email</h2>
              <p className="text-sm text-gray-400 mb-6">
                We sent a 6-digit code to the email linked to{" "}
                <span className="font-semibold text-brand">@{pendingUser}</span>.
                Enter it below to verify your account.
              </p>

              {error && (
                <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}
              {otpResent && (
                <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                  A new OTP has been sent!
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <label className="block mb-3 text-[0.72rem] font-medium tracking-widest uppercase text-gray-400">
                  Verification Code
                </label>
                <OTPInput value={otp} onChange={setOtp} />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full py-3 bg-brand text-white text-sm font-semibold rounded-lg tracking-wide
                    hover:opacity-85 active:opacity-100 hover:-translate-y-px active:translate-y-0
                    transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying…" : "Verify & Continue"}
                </button>
              </form>

              <p className="mt-5 text-center text-[0.82rem] text-gray-400">
                Didn't receive it?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-brand font-semibold hover:opacity-60 transition-opacity cursor-pointer disabled:opacity-40"
                >
                  Resend code
                </button>
              </p>
            </motion.div>
          )}

          {/* ════════════════ FORM SCREENS ════════════════ */}
          {stage === "form" && (
            <motion.div
              key="form-shell"
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* ── Tab Switcher ── */}
              <div className="relative flex bg-gray-100 rounded-xl p-1 mb-8">
                <div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[10px] bg-white shadow-sm transition-all duration-300 ease-in-out"
                  style={{ left: tab === "login" ? "4px" : "calc(50%)" }}
                />
                <button
                  id="tab-login"
                  onClick={() => switchTab("login")}
                  className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-[10px] transition-colors duration-200 cursor-pointer
                    ${tab === "login" ? "text-brand" : "text-gray-400"}`}
                >
                  Sign in
                </button>
                <button
                  id="tab-signup"
                  onClick={() => switchTab("signup")}
                  className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-[10px] transition-colors duration-200 cursor-pointer
                    ${tab === "signup" ? "text-brand" : "text-gray-400"}`}
                >
                  Sign up
                </button>
              </div>

              <AnimatePresence mode="wait" custom={dir}>

                {/* ─── LOGIN ─── */}
                {tab === "login" && (
                  <motion.div
                    key="login"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <h2 className="text-2xl font-bold text-brand mb-1">Welcome back</h2>
                    <p className="text-sm text-gray-400 mb-6">Enter your credentials to access the dashboard</p>

                    {error && (
                      <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit}>
                      <Field
                        id="login-userName" name="userName" label="Username"
                        placeholder="Username" value={loginForm.userName} onChange={handleLoginChange}
                      />
                      <Field
                        id="login-password" name="password" label="Password" type="password"
                        placeholder="••••••••" value={loginForm.password} onChange={handleLoginChange}
                      />

                      <button
                        type="submit"
                        id="btn-login"
                        disabled={loading}
                        className="mt-2 w-full py-3 bg-brand text-white text-sm font-semibold rounded-lg tracking-wide
                          hover:opacity-85 active:opacity-100 hover:-translate-y-px active:translate-y-0
                          transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? "Signing in…" : "Sign in"}
                      </button>
                    </form>

                    <p className="mt-5 text-center text-[0.82rem] text-gray-400">
                      Don't have an account?{" "}
                      <button
                        onClick={() => switchTab("signup")}
                        className="text-brand font-semibold hover:opacity-60 transition-opacity cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* ─── SIGN UP ─── */}
                {tab === "signup" && (
                  <motion.div
                    key="signup"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <h2 className="text-2xl font-bold text-brand mb-1">Create account</h2>
                    <p className="text-sm text-gray-400 mb-6">Get started with SentiChat today</p>

                    {error && (
                      <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSignupSubmit}>

                      {/* ── Avatar Picker ── */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[0.72rem] font-medium tracking-widest uppercase text-gray-400">
                            Choose avatar
                          </span>
                          <button
                            type="button"
                            onClick={refreshAvatars}
                            className="flex items-center gap-1 text-[0.72rem] font-medium text-brand hover:opacity-60 transition-opacity cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                              <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                            </svg>
                            Refresh
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          {avatarSeeds.map((seed) => (
                            <button
                              key={seed}
                              type="button"
                              onClick={() => selectAvatar(seed)}
                              className={`
                                relative rounded-xl p-1.5 border-2 transition-all duration-150 cursor-pointer
                                ${
                                  signupForm.avatar === seed
                                    ? "border-brand shadow-md shadow-brand/20 scale-[1.04]"
                                    : "border-gray-100 hover:border-brand/40 hover:scale-[1.02]"
                                }
                              `}
                            >
                              {!avatarLoaded[seed] && (
                                <div className="w-full aspect-square rounded-lg bg-gray-100 animate-pulse" />
                              )}
                              <img
                                src={avatarUrl(seed)}
                                alt={`Avatar option`}
                                onLoad={() => setAvatarLoaded((p) => ({ ...p, [seed]: true }))}
                                className={`w-full aspect-square object-cover rounded-lg transition-opacity duration-300 ${
                                  avatarLoaded[seed] ? "opacity-100" : "opacity-0 absolute inset-1.5"
                                }`}
                              />
                              {signupForm.avatar === seed && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-brand rounded-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Field
                        id="signup-userName" name="userName" label="Username"
                        placeholder="Username" value={signupForm.userName} onChange={handleSignupChange}
                      />
                      <Field
                        id="signup-email" name="email" label="Email" type="email"
                        placeholder="you@example.com" value={signupForm.email} onChange={handleSignupChange}
                      />
                      <Field
                        id="signup-password" name="password" label="Password" type="password"
                        placeholder="Min. 6 characters" value={signupForm.password} onChange={handleSignupChange}
                      />
                      <div className="mb-6">
                        <Field
                          id="signup-confirmPassword" name="confirmPassword" label="Confirm password" type="password"
                          placeholder="••••••••" value={signupForm.confirmPassword} onChange={handleSignupChange}
                        />
                      </div>

                      <button
                        type="submit"
                        id="btn-signup"
                        disabled={loading}
                        className="w-full py-3 bg-brand text-white text-sm font-semibold rounded-lg tracking-wide
                          hover:opacity-85 active:opacity-100 hover:-translate-y-px active:translate-y-0
                          transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? "Creating account…" : "Create account"}
                      </button>
                    </form>

                    <p className="mt-4 text-center text-[0.73rem] text-gray-300 leading-relaxed">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-brand font-medium">Terms of Service</a> and{" "}
                      <a href="#" className="text-brand font-medium">Privacy Policy</a>.
                    </p>

                    <p className="mt-3 text-center text-[0.82rem] text-gray-400">
                      Already have an account?{" "}
                      <button
                        onClick={() => switchTab("login")}
                        className="text-brand font-semibold hover:opacity-60 transition-opacity cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
