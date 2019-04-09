import React from "react";
import "./profileCard.css";

export const ProfileCard = props => {

  const filmRomanNumber = {
    "THE PHANTOM MENACE": "I",
    "ATTACK OF THE CLONES": "II",
    "REVENGE OF THE SITH": "III",
    "A NEW HOPE": "IV",
    "THE EMPIRE STRIKES BACK": "V",
    "RETURN OF THE JEDI": "VI",
    "THE FORCE AWAKENS": "VII"
  }

  return props.profileData ? (
    <div className="card">
      <div className="additional">
        <div className="profile-card">
          <div className="yob center">{props.profileData.birthYear}</div>
          <div className="gender center">{props.profileData.gender}</div>
          <img src={props.profileData.vectorArt} alt="vector-art" className="center"/>
        </div>
        <div className="more-info">
          <h1>{props.profileData.name}</h1>
          <h3>Films</h3>
          <div className="films">
          {props.profileData.filmTitles.map((filmTitle, index) => (
              <div key={`${filmTitle}-${index}`} className="title">{filmRomanNumber[filmTitle.toUpperCase()]}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="general">
        <h1>{props.profileData.name}</h1>
        <p>Planet of origin: {props.profileData.planetName}</p>
        <p>Height: {props.profileData.height}</p>
        <p>Mass: {props.profileData.mass}</p>
        <p>Eye Color: {props.profileData.eyeColor}</p>
        <span className="more">Mouse over the card for more info</span>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};
