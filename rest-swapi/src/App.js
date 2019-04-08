import React, { Component } from 'react';
import './App.css';

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
      <div className="App">
        <p>{JSON.stringify(this.state)}</p>
      </div>
    );
  }

  async getCharacterData() {
    const profileResponse = await fetch(this.ROOT_URL + "people/" + this.state.currentCharacterId, {mode: "cors"});
    const profileJson = await profileResponse.json();
    const {name, birth_year} = profileJson;

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

    this.setState({
      name,
      birth_year,
      planetName,
      filmTitles
    });
  }
}

export default App;
