import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Login } from "./components/Login/Login";
import { Signup } from "./components/Signup/Signup";
import { Game } from "./components/Game/Game";
import { PrivateRoute } from "./components/PrivateRoute";
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-content">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoute exact path="/game" component={Game} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
