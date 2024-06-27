import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { Button } from "./Button";
import "./HeroSection.css";

function HeroSection() {
  const audioRef = useRef(null);
  const [playedOnce, setPlayedOnce] = useState(false);

  useEffect(() => {
    if (audioRef.current && !playedOnce) {
      audioRef.current.play();
      setPlayedOnce(true);  // Asegura que el audio se reproduzca solo una vez al cargar
    }
  }, [playedOnce]);

  return (
    <div className="hero-container">
      <video src="/videos/250919_Hitech High_Tech Software Science_By_Gilad_Baron__Artlist_HD.mp4" autoPlay loop muted />
      { //<audio ref={audioRef} src="/Audio/SPEARFISHER - Inevitable.mp3" preload="auto" />
      }
      <h1>"From draft to defense, we’re with you."</h1>
      <p>What are you waiting for?</p>
      <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          GET STARTED
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
