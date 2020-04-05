import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Login } from "./components/Login/Login";
import { Signup } from "./components/Signup/Signup";
import { Game } from "./components/Game/Game";
import { Welcome } from "./components/Welcome/Welcome";
import { NotFound } from "./components/NotFound/NotFound";
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-content">
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/game" component={Game} />
            <Route path='/error' component={NotFound} />
            <Redirect from='*' to='/error' />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
