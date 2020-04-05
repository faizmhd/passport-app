import React from 'react';
import logo from './logo.svg';
import './Welcome.css';
import API from "../../utils/API";

export class Welcome extends React.Component {
  render() {
    return (
      <div class='container'>
        <div className="App" class="jumbotron text-center">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Welcome to FaizApp !
              </p>
          </header>
          <a href="/login" class="btn btn-default"><span class="fa fa-user"></span> Local Login</a>
          <a href="/signup" class="btn btn-default"><span class="fa fa-user"></span> Local Signup</a>
          <a href="http://localhost:8000/auth/facebook" class="btn btn-primary"><span class="fa fa-facebook"></span> Facebook</a>
          <a href="/auth/google" class="btn btn-danger"><span class="fa fa-google-plus"></span> Google</a>
        </div>
      </div>
    );
  }
}