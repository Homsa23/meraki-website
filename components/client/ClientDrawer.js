"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RecaptchaVerifier } from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyAuthError, useAuth } from "@/context/AuthContext";
import { getFirebaseAuth } from "@/lib/firebase";

const INK = "#08090C";
const RECAPTCHA_CONTAINER_ID = "meraki-recaptcha";

const PROVIDER_LABELS = {
  password: "EMAIL",
  "google.com": "GOOGLE",
  "phone": "PHONE",
};

function maskPhone(value) {
  if (!value) return "";
  return value.replace(/(\+\d{1,3})(\d+)(\d{2})/, (_, start, middle, end) => {
    return `${start} ${"•".repeat(Math.max(middle.length, 3))} ${end}`;
  });
}

export default function ClientDrawer({ open, onClose }) {
  const reduceMotion = useReducedMotion() === true;
  const {
    user,
    loading: authLoading,
    configured,
    configIssue,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPhoneCode,
    confirmPhoneCode,
    signOutUser,
  } = useAuth();

  const [mode, setMode] = useState("signin");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneStep, setPhoneStep] = useState("idle");

  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);

  const clearVerifier = useCallback(() => {
    try {
      recaptchaRef.current?.clear();
    } catch {
      // The widget may already be gone.
    }
    recaptchaRef.current = null;
  }, []);

  const resetTransientState = useCallback(() => {
    setStatus("idle");
    setError("");
    setCode("");
    setPhoneStep("idle");
    confirmationRef.current = null;
    clearVerifier();
  }, [clearVerifier]);

  const closeDrawer = useCallback(() => {
    resetTransientState();
    setPassword("");
    onClose();
  }, [onClose, resetTransientState]);

  useEffect(() => () => clearVerifier(), [clearVerifier]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeDrawer();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, closeDrawer]);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!configured || status === "processing") return;

    setError("");
    setStatus("processing");

    try {
      if (mode === "signup") {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }

      setPassword("");
      setStatus("idle");
    } catch (authError) {
      setError(friendlyAuthError(authError));
      setStatus("idle");
    }
  };

  const handleGoogle = async () => {
    if (!configured || status === "processing") return;

    setError("");
    setStatus("processing");

    try {
      await signInWithGoogle();
    } catch (authError) {
      setError(friendlyAuthError(authError));
    } finally {
      setStatus("idle");
    }
  };

  const handleSendCode = async (event) => {
    event.preventDefault();
    if (!configured || status === "processing") return;

    setError("");
    setStatus("processing");

    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(
          getFirebaseAuth(),
          RECAPTCHA_CONTAINER_ID,
          { size: "invisible" }
        );
      }

      confirmationRef.current = await sendPhoneCode(phone, recaptchaRef.current);
      setPhoneStep("code");
    } catch (authError) {
      setError(friendlyAuthError(authError));
      clearVerifier();
    } finally {
      setStatus("idle");
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    if (!configured || status === "processing") return;

    setError("");
    setStatus("processing");

    try {
      await confirmPhoneCode(confirmationRef.current, code);
      setCode("");
      setPhoneStep("idle");
      confirmationRef.current = null;
      clearVerifier();
      setStatus("idle");
    } catch (authError) {
      setError(friendlyAuthError(authError));
      setStatus("idle");
    }
  };

  const handleSignOut = async () => {
    setError("");
    setStatus("processing");

    try {
      await signOutUser();
      resetTransientState();
      setPassword("");
    } catch (authError) {
      setError(friendlyAuthError(authError));
      setStatus("idle");
    }
  };

  const changePhoneNumber = () => {
    setPhoneStep("phone");
    setCode("");
    setError("");
    confirmationRef.current = null;
    clearVerifier();
  };

  const processing = status === "processing";
  const identity = user?.displayName || user?.email || user?.phoneNumber || "MEMBER";
  const providerLabel = user?.providerId
    ? PROVIDER_LABELS[user.providerId] ?? "MEMBER"
    : "MEMBER";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="client-drawer"
          className="fixed inset-0 z-[130]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          style={{ color: INK }}
        >
          {/* Very light scrim — barely there, just enough to focus the panel. */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close client archive"
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full cursor-default bg-deep-ink/[0.04] backdrop-blur-[2px]"
          />

          {/* Frosted glass panel — no borders, only a whisper of a shadow. */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Client archive"
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white/40 px-7 pb-8 pt-6 shadow-[-32px_0_80px_rgba(8,9,12,0.06)] backdrop-blur-lg md:px-10 md:pb-10 md:pt-8"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-start justify-between">
              <span className="font-editorial text-[13px] lowercase tracking-[0.28em] text-deep-ink/80">
                meraki
                <span className="ml-0.5 align-super text-[7px] tracking-normal">
                  ®
                </span>
              </span>

              <button
                type="button"
                aria-label="Close client archive"
                autoFocus
                onClick={closeDrawer}
                className="-mr-1 px-1 py-1 text-[10px] uppercase tracking-[0.22em] text-deep-ink/70 transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none"
              >
                Close
              </button>
            </div>

            <div className="my-auto w-full max-w-[320px] self-center">
              <h2 className="font-editorial text-[26px] font-normal uppercase leading-none tracking-widest text-deep-ink md:text-[30px]">
                Client Archive
              </h2>

              {authLoading ? (
                <div role="status" aria-live="polite" className="mt-14">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-deep-ink/60">
                    LOADING CLIENT...
                  </span>
                </div>
              ) : !configured ? (
                <div className="mt-10">
                  <p className="text-[9px] uppercase leading-relaxed tracking-[0.3em] text-crimson">
                    FIREBASE NOT CONNECTED
                  </p>
                  <p className="mt-5 text-[10px] leading-relaxed tracking-[0.12em] text-deep-ink/60">
                    Add the <span className="text-deep-ink">meraki-92e3f</span>{" "}
                    web app credentials to{" "}
                    <span className="text-deep-ink">.env.local</span> to enable
                    email, Google and phone sign-in.
                  </p>
                  {configIssue && (
                    <p className="mt-4 text-[8px] uppercase leading-relaxed tracking-[0.18em] text-basalt/45">
                      {configIssue}
                    </p>
                  )}
                </div>
              ) : user ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-10"
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] text-crimson">
                    ACCESS GRANTED
                  </p>

                  <p className="mt-6 break-words font-editorial text-[18px] leading-snug text-deep-ink">
                    {identity}
                  </p>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.24em] text-basalt/50">
                    VIA {providerLabel}
                    {user.emailVerified ? " / VERIFIED" : ""}
                  </p>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={processing}
                    className="mt-12 inline-flex text-[10px] uppercase tracking-[0.34em] text-deep-ink transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none disabled:cursor-wait disabled:opacity-45"
                  >
                    {processing ? "SIGNING OUT..." : "[ SIGN OUT ]"}
                  </button>
                </motion.div>
              ) : (
                <div className="mt-10">
                  <p className="text-[8px] uppercase tracking-[0.26em] text-basalt/50">
                    {mode === "signup" ? "CREATE CLIENT ACCESS" : "CLIENT ACCESS"}
                  </p>

                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={processing}
                    className="mt-7 w-full bg-deep-ink px-5 py-3.5 text-[9px] uppercase tracking-[0.3em] text-white transition-colors duration-500 hover:bg-crimson focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-crimson disabled:cursor-wait disabled:opacity-60"
                  >
                    CONTINUE WITH GOOGLE
                  </button>

                  <div className="my-7 flex items-center gap-3">
                    <span aria-hidden="true" className="h-px flex-1 bg-deep-ink/15" />
                    <span className="text-[8px] uppercase tracking-[0.24em] text-basalt/40">
                      or
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-deep-ink/15" />
                  </div>

                  {phoneStep === "idle" ? (
                    <form onSubmit={handleEmailSubmit}>
                      {mode === "signup" && (
                        <>
                          <label htmlFor="client-name" className="sr-only">
                            Name
                          </label>
                          <input
                            id="client-name"
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder="Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            disabled={processing}
                            className="w-full appearance-none rounded-none border-0 border-b border-deep-ink/80 bg-transparent px-0 py-3 text-[11px] tracking-widest text-deep-ink transition-colors duration-500 placeholder:text-deep-ink/40 focus:border-deep-ink focus:outline-none focus:ring-0 disabled:opacity-45"
                          />
                        </>
                      )}

                      <label htmlFor="client-email" className="sr-only">
                        Email Address
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={processing}
                        required
                        className="w-full appearance-none rounded-none border-0 border-b border-deep-ink/80 bg-transparent px-0 py-3 text-[11px] tracking-widest text-deep-ink transition-colors duration-500 placeholder:text-deep-ink/40 focus:border-deep-ink focus:outline-none focus:ring-0 disabled:opacity-45"
                      />

                      <label htmlFor="client-password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="client-password"
                        type="password"
                        name="password"
                        autoComplete={
                          mode === "signup" ? "new-password" : "current-password"
                        }
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={processing}
                        required
                        minLength={6}
                        className="w-full appearance-none rounded-none border-0 border-b border-deep-ink/80 bg-transparent px-0 py-3 text-[11px] tracking-widest text-deep-ink transition-colors duration-500 placeholder:text-deep-ink/40 focus:border-deep-ink focus:outline-none focus:ring-0 disabled:opacity-45"
                      />

                      <button
                        type="submit"
                        disabled={processing}
                        aria-live="polite"
                        className="mt-8 inline-flex text-[10px] font-light uppercase tracking-[0.34em] text-deep-ink transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none disabled:cursor-wait disabled:opacity-45"
                      >
                        {processing
                          ? "PROCESSING..."
                          : mode === "signup"
                            ? "CREATE ACCOUNT"
                            : "SIGN IN"}
                      </button>

                      <div className="mt-8 flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMode(mode === "signup" ? "signin" : "signup");
                            setError("");
                          }}
                          disabled={processing}
                          className="self-start text-[8px] uppercase tracking-[0.24em] text-basalt/55 transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none"
                        >
                          {mode === "signup"
                            ? "ALREADY A CLIENT? SIGN IN"
                            : "NEW CLIENT? CREATE ACCOUNT"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPhoneStep("phone");
                            setError("");
                          }}
                          disabled={processing}
                          className="self-start text-[8px] uppercase tracking-[0.24em] text-basalt/55 transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none"
                        >
                          USE PHONE NUMBER INSTEAD
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={
                        phoneStep === "phone" ? handleSendCode : handleVerifyCode
                      }
                    >
                      {phoneStep === "phone" ? (
                        <>
                          <label htmlFor="client-phone" className="sr-only">
                            Phone number
                          </label>
                          <input
                            id="client-phone"
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="+233 24 000 0000"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            disabled={processing}
                            required
                            className="w-full appearance-none rounded-none border-0 border-b border-deep-ink/80 bg-transparent px-0 py-3 text-[11px] tracking-widest text-deep-ink transition-colors duration-500 placeholder:text-deep-ink/40 focus:border-deep-ink focus:outline-none focus:ring-0 disabled:opacity-45"
                          />

                          <button
                            type="submit"
                            disabled={processing}
                            aria-live="polite"
                            className="mt-8 inline-flex text-[10px] font-light uppercase tracking-[0.34em] text-deep-ink transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none disabled:cursor-wait disabled:opacity-45"
                          >
                            {processing ? "SENDING CODE..." : "SEND CODE"}
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-[9px] uppercase leading-relaxed tracking-[0.24em] text-basalt/60">
                            CODE SENT TO {maskPhone(phone)}
                          </p>

                          <label htmlFor="client-code" className="sr-only">
                            Verification code
                          </label>
                          <input
                            id="client-code"
                            type="text"
                            name="code"
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            placeholder="6-DIGIT CODE"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            disabled={processing}
                            required
                            className="mt-4 w-full appearance-none rounded-none border-0 border-b border-deep-ink/80 bg-transparent px-0 py-3 text-[11px] tracking-widest text-deep-ink transition-colors duration-500 placeholder:text-deep-ink/40 focus:border-deep-ink focus:outline-none focus:ring-0 disabled:opacity-45"
                          />

                          <button
                            type="submit"
                            disabled={processing}
                            aria-live="polite"
                            className="mt-8 inline-flex text-[10px] font-light uppercase tracking-[0.34em] text-deep-ink transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none disabled:cursor-wait disabled:opacity-45"
                          >
                            {processing ? "VERIFYING..." : "VERIFY CODE"}
                          </button>

                          <button
                            type="button"
                            onClick={changePhoneNumber}
                            disabled={processing}
                            className="mt-5 block text-[8px] uppercase tracking-[0.24em] text-basalt/55 transition-opacity duration-500 hover:opacity-45 focus-visible:opacity-45 focus-visible:outline-none"
                          >
                            USE A DIFFERENT NUMBER
                          </button>
                        </>
                      )}

                      <div id={RECAPTCHA_CONTAINER_ID} className="mt-6" />
                    </form>
                  )}

                  {error && (
                    <p
                      role="alert"
                      className="mt-6 text-[8px] uppercase leading-relaxed tracking-[0.18em] text-crimson"
                    >
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>

            <span className="text-[8px] uppercase tracking-[0.24em] text-deep-ink/40">
              MMXXVI
            </span>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
