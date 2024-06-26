import React, { useState } from "react";
import "../../App.css"; // Asegúrate de que tu CSS esté correctamente importado
import { Link } from 'react-router-dom';


export default function SignUp() {

  const [click, setClick] = useState(false);

  const closeMobileMenu = () => setClick(false);

  const [isSignUpActive, setIsSignUpActive] = useState(true);

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-signup-container">
      <div className="blurred-image"></div>{" "}
      {/* Nueva div para la imagen difuminada */}
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
            <h2 ></h2>
            <Link
                to='/dashboard'
                className="form__title"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <a href="#" className="link">
              Forgot your password?
            </a>

            <button className="btn">Sign In</button>
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
