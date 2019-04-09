import React, { Component } from "react";
import "./App.css";
import ApolloClient, { gql } from "apollo-boost";
import { ProfileCard } from "./components/Profile/ProfileCard";

class App extends Component {
  client = new ApolloClient({
    uri: "http://localhost:63085"
  });

  state = {
    currentCharacterId: 1
  };

  componentDidMount() {
    this.getCharacterData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentCharacterId !== this.state.currentCharacterId) {
      this.getCharacterData();
    }
  }

  render() {
    return (
      <div className="center">
        <ProfileCard profileData={this.state.profileData} />
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

  getCharacterData() {
    this.client
      .query({
        query: gql`
      {
        person(personID: ${this.state.currentCharacterId}) {
          name,
          birthYear,
          height,
          gender,
          mass,
          eyeColor
          homeworld {
            name
          },
          filmConnection {
            films {
              title
            }
          }
        }
      }`
      })
      .then(result =>
        import(`./assets/${result.data.person.name
          .replace(/ /g, "_")
          .toLowerCase()}.svg`).then(src =>
          this.setState({
            profileData: {
              name: result.data.person.name,
              birthYear: result.data.person.birthYear,
              height: result.data.person.height,
              gender: result.data.person.gender,
              mass: result.data.person.mass,
              eyeColor: result.data.person.eyeColor,
              planetName: result.data.person.homeworld.name,
              filmTitles: result.data.person.filmConnection.films.map(
                film => film.title
              ),
              vectorArt: src.default
            }
          })
        )
      );
  }
}

export default App;
