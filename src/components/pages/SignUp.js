import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth"; // Asegúrate de que la ruta sea correcta
import "../../App.css";
import googleIcon from "../../assets/icons/web_light_rd_na.svg";
import { getAuth, signInWithPopup, GoogleAuthProvider, getRedirectResult , fetchSignInMethodsForEmail } from "firebase/auth";
//import { useAuth } from "../firebase/auth";
import { auth } from "components/firebase/firebase";

export default function SignUp() {
  //const {userLoggedIn} = useAuth();
  
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoggedIn, setISLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");  // Estado para el nombre de usuario
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const navigate = useNavigate();

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
    if (isSigningIn) return; // Asegura que no se procese múltiples veces

    // Validación del correo y la contraseña
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!isValidPassword(password, confirmPassword)) {
      setErrorMessage(
        "Password must be at least 8 characters long, include special characters, and both passwords must match."
      );
      return;
    }

    setIsSigningIn(true); // Indica que el proceso de registro ha iniciado
    try {
      const userCredential = await doCreateUserWithEmailAndPassword(
        email,
        password
      );
      if (userCredential) {
        alert("Account created successfully. Please sign in.");
        resetForm(); // Reinicia el formulario y la UI
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert(
          "The email address is already in use by another account. Please log in."
        );
      } else {
        alert(error.message); // Maneja otros posibles errores
      }
    }
    setIsSigningIn(false); // Restablece el estado de registro
  };

  function resetForm() {
    setUsername("");  // Añade esto para limpiar el nombre de usuario
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsSignUpActive(false); // Opcional: cambia la UI al estado de 'log in'
    setIsSigningIn(false);
  }

  const onGoogleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {

        const {displayName, email} = result.user;
        setUserData({displayName, email})
        
        setISLoggedIn(true);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        console.log({ error });
      });
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
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) =>{
        console.log(result);
        if(result.user){
          alert("user logged in Succesfully!")
        }
        navigate("/dashboard");
      })
  };

  return (
    <div className="login-signup-container">
      <div className="blurred-image"></div>
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
      >
        <div className="container__form container--signup">
          <form className="form" id="form1" onSubmit={onSubmitSignUp}> 
              <h2 className="form__title">Sign Up</h2>
              <input
                type="text"
                placeholder="User"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" className="btn"> 
                  Sign Up
              </button>
              <br />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <br />
              <span>Or sign Up with:</span>
              <br />
              <button type="button" onClick={onGoogleSignUp}>
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
                src="/imagen/logo2.png"
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
                src="/imagen/logo2.png"
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
