import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import BrandIcon from "../components/BrandIcon";
import SectionHeader from "../components/SectionHeader";
import { verifyGoogleAuthCode } from "../services/google";
import "./Auth.css";

type TAuthProps = {
  onSignIn: (email: string) => void;
};

type TGoogleAuthButtonProps = {
  onSignIn: (email: string) => void;
};

function GoogleAuthButton({ onSignIn }: TGoogleAuthButtonProps) {
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setGoogleErrorMessage("");
        const tokens = await verifyGoogleAuthCode(codeResponse.code);
        const email = typeof tokens.email === "string" ? tokens.email : "google-user";
        onSignIn(email);
      } catch {
        setGoogleErrorMessage("Google sign-in was not completed. Please try again.");
      }
    },
    onError: () => {
      setGoogleErrorMessage("Google sign-in was cancelled or failed.");
    },
  });

  return (
    <>
      <div className="auth-divider" aria-hidden="true">
        <span>or</span>
      </div>
      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => googleLogin()}
      >
        Continue with Google
      </button>
      {googleErrorMessage ? <p className="auth-error">{googleErrorMessage}</p> : null}
    </>
  );
}

export default function Auth({ onSignIn }: TAuthProps) {
  const demoEmail = "demo-user@example.com";

  const useGoogleAuth = import.meta.env.VITE_USE_GOOGLE_AUTH?.toLowerCase() === "true";
  const hasAuthClientId = (import.meta.env.VITE_AUTH_CLIENT_ID?.trim().length ?? 0) > 0;
  const shouldShowGoogleAuth = useGoogleAuth && hasAuthClientId;

  const handleDemoSignIn = () => {
    onSignIn(demoEmail);
  };

  return (
    <section className="auth-page" aria-labelledby="auth-heading">
      <div className="auth-card panel-surface">
        <div className="auth-brand">
          <BrandIcon className="auth-brand-icon" />
          <div className="auth-brand-copy">
            <p className="auth-brand-name">PlumToDo</p>
          </div>
        </div>

        <SectionHeader
          titleId="auth-heading"
          kicker="Welcome"
          title="Sign In"
        />

        <button className="auth-submit btn btn--primary" type="button" onClick={handleDemoSignIn}>
          Continue as Demo User
        </button>

        {shouldShowGoogleAuth ? <GoogleAuthButton onSignIn={onSignIn} /> : null}
      </div>
    </section>
  );
}
