// src/components/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignU,
} from "../firebase/auth"; // Asegúrate de que la ruta sea correcta
import "../../App.css";
import googleIcon from "../../assets/icons/web_light_rd_na.svg";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import auth from "../firebase-config";


export default function SignUp() {
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSwitchToSignIn = () => {
    setIsSignUpActive(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };
  
  const handleSwitchToSignUp = () => {
    setIsSignUpActive(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };


  const isValidPassword = (password, confirmPassword) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const passwordsMatch = password === confirmPassword;
    return password.length >= minLength && hasSpecialChar && passwordsMatch;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const onSubmitSignUp = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      if (!isValidEmail(email)) {
        setErrorMessage("Please enter a valid email address.");
        return; // Detiene la ejecución si el correo no es válido
      }
      if (!isValidPassword(password, confirmPassword)) {
        setErrorMessage(
          "Password must be at least 8 characters long, include special characters, and both passwords must match."
        );
        return; // Detiene la ejecución si la contraseña no es válida
      }
      setIsSigningIn(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        setIsSignUpActive(false); // Cambia a la vista de inicio de sesión
        setEmail(""); // Limpia el correo
        setPassword(""); // Limpia la contraseña
        setConfirmPassword(""); // Limpia la confirmación de la contraseña
        setIsSigningIn(false);
        alert("Account created successfully. Please sign in."); // Muestra alerta de cuenta creada
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          alert("The email address is already in use by another account."); // Muestra alerta de email en uso
        } else {
          alert(error.message); // Muestra alerta de otros errores
        }
        setIsSigningIn(false);
      }
    }
  };

  
    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const token = result.credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            if (result.additionalUserInfo.isNewUser) {
                alert("Account created successfully. Please sign in.");
            } else {
                alert("Welcome back! You have signed in successfully.");
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            alert("Failed to sign in with Google: " + error.message);
        }
    };


  const onSubmitSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
        alert(error.message); // Muestra alerta de error de inicio de sesión
      }
    }
  };

  const doSignInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Resultado de la autenticación:", result);
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      console.log("Código de error:", error.code); // Esto puede ayudarte a entender mejor el problema
      throw error;
    }
  };
  

  



  
  return (
    <div className="login-signup-container">
      <div className="blurred-image"></div>
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
      >
        <div className="container__form container--signup">
          <form className="form" id="form1">
            <h2 className="form__title">Sign Up</h2>
            <input type="text" placeholder="User" className="input" />
            <input
              type="email"
              placeholder="Email"
              className="input"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="btn" onClick={onSubmitSignUp}>
              Sign Up
            </button>
            <br />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <br />
            <span>Or sign Up with:</span>
            <br />
            <button type="button" onClick={handleGoogleSignUp}>
              <img src={googleIcon} alt="Google Icon" className="google-icon" />
            </button>
          </form>
        </div>

        <div className="container__form container--signin">
          <form className="form" id="form2">
            <h2 className="form__title">Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              className="input"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className="link">
              Forgot your password?
            </a>
            <button className="btn" onClick={onSubmitSignIn}>
              Sign In
            </button>
            <br />
            <spam>Or sign In with:</spam>
            <br />
            <button type="button" onClick={doSignInWithGoogle}>
              <img src={googleIcon} alt="Google Icon" className="google-icon" />
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>

        <div className="container__overlay">
          <div className="overlay">
            <div className="overlay__panel overlay--left">
              <img
                src="/images/Landsacpe.png"
                alt="Logo"
                className="logo logo-signup"
              />
              <button
                className="btn"
                id="signIn"
                onClick={() => setIsSignUpActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay__panel overlay--right">
              <img
                src="/images/Landsacpe.png"
                alt="Logo"
                className="logo logo-signin"
              />
              <button
                className="btn"
                id="signUp"
                onClick={() => setIsSignUpActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
