import React, { Component } from "react";
import "./App.css";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import "assets/scss/material-kit-react.scss?v=1.8.0";

// pages for this product
import Components from "views/Components/Components.js";
import Home from "views/Components/Home.js";
import LandingPage from "./views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";

class App extends Component {
  state = {};

  render() {
    // let history = useHistory();
    return (
      <Router history={createBrowserHistory()}>
        <Switch>
          <Route path="/landing-page" component={LandingPage} />
          <Route path="/profile-page" component={ProfilePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/home" component={Home} />
          <Route path="/" component={Components} />
        </Switch>
      </Router>
    );
  }
}

export default App;
