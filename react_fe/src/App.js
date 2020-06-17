import React, { Component } from "react";
import { createBrowserHistory } from "history";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "assets/scss/material-kit-react.scss?v=1.8.0";

// pages for this product
import Components from "views/Components/Components.js";
import Home from "views/Components/Home.js";
import LandingPage from "./views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import Layout from "./Layout";
import SignUp from "./views/SignUpPage/SignUp";
// import PrivateRoute from "./PrivateRoute";

// export default function App(props){
//   const [isLogedIn, setLogedIn] = React.useState( true ? 'haha': 'hoho')
//   const classes = useStyles();
//   const { ...rest } = props;

// }
class App extends Component {
  state = {
    token: localStorage.getItem("token"),
  };

  userLogin = () => {
    this.setState({ token: true });
  };

  userLogout = () => {
    localStorage.clear();
    this.setState({ token: null });
  };

  render() {
    const { token } = this.state;
    const { userLogin, userLogout } = this;

    return (
      <Router history={createBrowserHistory()}>
        <Layout userLogin={userLogin} userLogout={userLogout} token={token}>
          <Switch>
            <Route
              path="/landing-page"
              component={LandingPage}
              userLogout={this.userLogout}
            />
            <Route
              path="/profile-page"
              component={ProfilePage}
              userLogout={this.userLogout}
            />

            <Route path="/signup" component={SignUp} />
            <Route
              path="/login"
              render={(props) => {
                if (token) return <Redirect to="/home" />;
                else return <LoginPage {...props} userLogin={userLogin} />;
              }}
            />
            <Route
              path="/home"
              render={(props) => {
                if (token)
                  return <Home {...props} token={token} component={Home} />;
                else return <Redirect to="/login" />;
              }}
            />
            <Route path="/" exact component={Components} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
