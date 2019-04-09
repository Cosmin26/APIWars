import React, { Component } from 'react';
import './App.css';
import ApolloClient, { gql } from "apollo-boost";

class App extends Component {

  client = new ApolloClient({
    uri: "http://localhost:63085"
  })

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

  render() {
    return (
      <div className="App">
         <p>{JSON.stringify(this.state)}</p>
      </div>
    );
  }

  getCharacterData() {
    this.client.query({
      query: gql`
      {
        person(personID: 1) {
          name,
          birthYear,
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
    }).then(result =>
      this.setState({
        name: result.data.person.name,
        birthYear: result.data.person.birthYear,
        planetName: result.data.person.homeworld.name,
        filmTitles: result.data.person.filmConnection.films.map(film => film.title)
      })
    );
  }
}

export default App;
