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
import Home from "views/HomePage/Home.js";
import LandingPage from "./views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import Layout from "./Layout";
import SignUp from "./views/SignUpPage/SignUp";
import ErrorPage from "./views/Error/404";
import jwt from "jsonwebtoken";
import MyList from "./views/MyListPage/MyList";
// import PrivateRoute from "./PrivateRoute";
// export default function App(props){
//   const [isLogedIn, setLogedIn] = React.useState( true ? 'haha': 'hoho')
//   const classes = useStyles();
//   const { ...rest } = props;

// }
class App extends Component {
  state = {
    token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
    query: "",
    payload: localStorage.getItem("token")
      ? jwt.decode(localStorage.getItem("token"))
      : null,
  };

  onQueryChange = (query) => {
    this.setState({ query: query });
  };

  userLogin = (value) => {
    let payload = jwt.decode(value);
    this.setState({ token: value, payload });
  };

  // componentDidUpdate(prevProps, prevState) {
  //   const { token } = this.state;
  //   if (token !== prevState.token && token !== null) {
  //     let payload = jwt.decode(token);
  //     this.setState({ payload });
  //   }
  // }

  userLogout = () => {
    localStorage.clear();
    this.setState({ token: null, payload: null });
  };

  render() {
    const { token, query, payload } = this.state;
    const { userLogin, userLogout, onQueryChange } = this;

    return (
      <Router history={createBrowserHistory()}>
        <Layout
          userLogin={userLogin}
          userLogout={userLogout}
          token={token}
          onQueryChange={onQueryChange}
        >
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
              path="/mylist"
              render={(props) => {
                return <MyList {...props} userLogin={userLogin} />;
              }}
            />
            <Route
              path="/home"
              render={(props) => {
                if (token)
                  return (
                    <Home
                      {...props}
                      query={query}
                      component={Home}
                      payload={payload}
                    />
                  );
                else return <Redirect to="/login" />;
              }}
            />
            <Route path="/" exact component={Components} />
            <Route path="/404" exact>
              <ErrorPage />
            </Route>
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
