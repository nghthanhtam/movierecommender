import React from "react";
import { Link, useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotesIcon from "@material-ui/icons/Notes";
// core components

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import Input from "../Components/Input.js";
import Danger from "components/Typography/Danger.js";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import axios from "axios";

const useStyles = makeStyles(styles);

export default function SignUp(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [fullname, setFullname] = React.useState("");

  const [error, setError] = React.useState("");
  const history = useHistory();
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const validatePassword = (password) => {
    return /^[a-zA-Z0-9]{8,}$/.test(password);
  };

  const validateVerifyPassowrd = (verifyPassword) => {
    return verifyPassword === password;
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const validateFullname = (name) => {
    return /^[a-zA-Z ]+$/.test(name);
  };
  const validateUsername = (username) => {
    return /^[a-zA-Z0-9_]{5,}$/.test(username);
  };
  const handleChange = (e) => {
    const { value, id } = e.target;

    switch (id) {
      case "password":
        setPassword(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "verifyPassword":
        setVerifyPassword(value);
        break;
      case "fullname":
        setFullname(value);
        break;
      case "username":
        setUsername(value);
        break;
      default:
        // code block
        console.log("default reached");
    }
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const submit = (e) => {
    e.preventDefault();
    let user = {
      email,
      password,
      fullname,
      verifyPassword,
      role: 3,
      username,
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_HOST}/users`, user, config)
      .then((res) => {
        const { message } = res.data;
        setError(message);
        setTimeout(function () {
          history.push("/login");
        }, 5000);
      })
      .catch((er) => {
        const { message } = er.response.data;
        setError(message);
      });
  };

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes[cardAnimaton]}>
            <form className={classes.form} onSubmit={submit}>
              <h2 className={classes.divider} style={{ color: "#9c27b0" }}>
                Sign up
              </h2>
              {error === "" ? (
                ""
              ) : (
                <h4
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    color: "#f44336",
                  }}
                >
                  {error}
                </h4>
              )}
              <CardBody>
                <Input
                  id="email"
                  labeltext="Email"
                  validation={validateEmail}
                  type="email"
                  handleChange={handleChange}
                  input={email}
                  classes={classes.inputIconsColor}
                  errorText="Your email is incorrect. Please check your spelling."
                />

                <Input
                  id="username"
                  labeltext="Username"
                  validation={validateUsername}
                  type="username"
                  handleChange={handleChange}
                  input={username}
                  classes={classes.inputIconsColor}
                  errorText="Username must contain only letters, numbers and underscores!
                  Username must be at least 5 letters!"
                />

                <Input
                  id="fullname"
                  labeltext="Fullname"
                  validation={validateFullname}
                  type="username"
                  handleChange={handleChange}
                  input={fullname}
                  classes={classes.inputIconsColor}
                  errorText="Name must contain characters only!"
                />
                {/* Password */}
                <Input
                  id="password"
                  labeltext="Password"
                  validation={validatePassword}
                  type="password"
                  handleChange={handleChange}
                  input={password}
                  classes={classes.inputIconsColor}
                  errorText="Password must contain only lowercase letters, uppercase
                  letters and numbers! Password must be at least 8 letters!"
                />
                <Input
                  id="verifyPassword"
                  labeltext="Verify password"
                  validation={validateVerifyPassowrd}
                  type="password"
                  handleChange={handleChange}
                  input={verifyPassword}
                  classes={classes.inputIconsColor}
                  errorText="Doesn't match with password!"
                />
              </CardBody>
              <CardFooter className={classes.cardFooter}>
                <Button
                  simple
                  type="submit"
                  color="primary"
                  disabled={
                    email === ""
                      ? true
                      : !validateEmail(email)
                      ? true
                      : password === ""
                      ? true
                      : !validatePassword(password)
                      ? true
                      : verifyPassword === ""
                      ? true
                      : !validateVerifyPassowrd(verifyPassword)
                      ? true
                      : fullname === ""
                      ? true
                      : !validateFullname(fullname)
                      ? true
                      : username === ""
                      ? true
                      : !validateUsername(username)
                      ? true
                      : false
                  }
                  size="lg"
                >
                  Get started
                </Button>
              </CardFooter>
              <CardFooter className={classes.cardFooter}>
                <div>
                  Already got an account? Sign in <Link to="/login">here</Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
