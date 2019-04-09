import React, { Component } from 'react';
import './App.css';
import { ProfileCard } from './components/Profile/ProfileCard';

class App extends Component {

  ROOT_URL = "https://swapi.co/api/"

  state = {
    currentCharacterId: 1
  }

  componentDidMount() {
    this.getCharacterData();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.currentCharacterId !== this.state.currentCharacterId) {
      this.getCharacterData();
    }
  }

  handleChangeCharacter = (event) => {
    this.setState((prevState) => ({
        currentCharacterId: prevState + event.target.dataset.step
      })
    );
  }
 
  render() {
    return (
      <div className="center">
        <ProfileCard profileData={this.state.profileData}/>
        <button onClick={this.handleChangeCharacter} data-step="-1">
          Prev
        </button>
        <button onClick={this.handleChangeCharacter} data-step="1">
          Next
        </button>
      </div>
    );
  }

  handleChangeCharacter = event => {
    const step = parseInt(event.target.dataset.step);

    this.setState(prevState => {
      const newCharacterId = prevState.currentCharacterId + step;
      if (newCharacterId > 0 && newCharacterId < 4) {
        return {
          currentCharacterId: newCharacterId
        };
      }
    });
  };

  async getCharacterData() {
    const profileResponse = await fetch(this.ROOT_URL + "people/" + this.state.currentCharacterId, {mode: "cors"});
    const profileJson = await profileResponse.json();
    const {name, birth_year: birthYear, height, mass, eye_color: eyeColor, gender} = profileJson;

    const planetResponse = await fetch(profileJson.homeworld, {mode: "cors"});
    const planetJson = await planetResponse.json();
    const planetName = planetJson.name;
    
    let filmResponse;
    const filmTitlePromises = profileJson.films.map(async (filmEndpoint) =>  {
      filmResponse = await fetch(filmEndpoint, {mode: "cors"});
      return filmResponse.json();
    });
    const filmJsons = await Promise.all(filmTitlePromises);
    const filmTitles = filmJsons.map(filmJson => filmJson.title);

    import(`./assets/${name
      .replace(/ /g, "_")
      .toLowerCase()}.svg`).then(src =>
    this.setState({
      profileData: {
        name,
        birthYear,
        height,
        gender,
        mass,
        eyeColor,
        planetName,
        filmTitles,
        vectorArt: src.default
      }
    })
      );
  }
}

export default App;
