// src/components/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase"; // Asegúrate de importar tu configuración de Firebase
import "../../App.css"; // Asegúrate de que tu CSS esté correctamente importado
import googleIcon from "../../assets/icons/web_light_rd_na.svg"; // Importa tu icono de Google

export default function SignUp() {
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías manejar la lógica de autenticación.
    // Si la autenticación es exitosa, redirige al dashboard:
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    try {
      await auth.signInWithPopup(googleProvider);
      alert('Logged in successfully');
      navigate('/dashboard'); // Redirige al dashboard después de iniciar sesión
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-signup-container">
      <div className="blurred-image"></div>
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
      >
        {/* Sign Up */}
        <div className="container__form container--signup">
          <form
            action="#"
            className="form"
            id="form1"
            onSubmit={handleFormSubmit}
          >
            <h2 className="form__title">Sign Up</h2>
            <input type="text" placeholder="User" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <button className="btn">Sign Up</button>
            <button type="button" className="btn google-btn" onClick={handleGoogleSignIn}>
              <img src={googleIcon} alt="Google Icon" className="google-icon" /> Sign Up with Google
            </button>
          </form>
        </div>

        {/* Sign In */}
        <div className="container__form container--signin">
          <form
            action="#"
            className="form"
            id="form2"
            onSubmit={handleFormSubmit}
          >
            <h2 className="form__title">Sign In</h2>
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <a href="#" className="link">
              Forgot your password?
            </a>
            <button className="btn">Sign In</button>
            <button type="button" className="btn google-btn" onClick={handleGoogleSignIn}>
              <img src={googleIcon} alt="Google Icon" className="google-icon" /> Sign In with Google
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className="container__overlay">
          <div className="overlay">
            <div className="overlay__panel overlay--left">
              <img
                src="/images/Landsacpe.png"
                alt="Logo"
                className="logo logo-signup"
              />
              <button className="btn" id="signIn" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay__panel overlay--right">
              <img
                src="/images/Landsacpe.png"
                alt="Logo"
                className="logo logo-signin"
              />
              <button className="btn" id="signUp" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
