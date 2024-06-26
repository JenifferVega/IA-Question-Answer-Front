import React from "react";
import "./Cards.css";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <h1>Our Services</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/img-9.jpg"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
               Sed sit amet lacus id nisi porta condimentum. Maecenas non libero
                quis metus consequat auctor non sit amet est."
              label="AI"
              path="/services"
            />
            <CardItem
              src="images/img-2.jpg"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed sit amet lacus id nisi porta condimentum. Maecenas non libero
               quis metus consequat auctor non sit amet est."
              label="Gestor de proyectos"
              path="/services"
            />
            <CardItem
              src="images/img-3.jpg"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
               Sed sit amet lacus id nisi porta condimentum. Maecenas non libero
                quis metus consequat auctor non sit amet est."
              label="Freelancer Services"
              path="/services"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
