import React from "react";
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOpenIcon from "@material-ui/icons/LockOpen";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Danger from "components/Typography/Danger.js";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import Input from "../Components/Input.js";
import axios from "axios";
const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const { userLogin } = props;
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const validatePassword = (password) => {
    return /^[a-zA-Z0-9]{8,}$/.test(password);
  };
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
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

      default:
        console.log("Reached default");
        break;
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
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_HOST}/users/login`, user, config)
      .then((res) => {
        const { message } = res.data;
        localStorage.setItem("token", message);
        userLogin();
      })
      .catch((er) => {
        const { message } = er.response.data;
        // console.log(er);
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
                Sign in
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
                      : false
                  }
                  size="lg"
                >
                  Get started
                </Button>
              </CardFooter>
              <CardFooter className={classes.cardFooter}>
                <div>
                  New to Pornhub? Sign up <Link to="/signup">here</Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
