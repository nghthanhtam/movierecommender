import React, { Fragment, Component } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
import LockOpenIcon from '@material-ui/icons/LockOpen';
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";


import Danger from "components/Typography/Danger.js";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";

import axios from 'axios';

const useStyles = makeStyles(styles)


export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const temp = true;
  const classes = useStyles();
  const { ...rest } = props;
  const validatePassword = password => {
    return (/^[a-zA-Z0-9]{8,}$/).test(password);
  }
  const validateEmail = email => {
    return (/\S+@\S+\.\S+/).test(email);
  }
  const handleChange = e => {
    const { value } = e.target
    if(e.target.id === 'password'){
      setPassword(value);
    } else {
      if(e.target.id === 'email'){
        setEmail(value);
      }
    }
    
  };

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  const submit = e =>{
    e.preventDefault()
    let user = {
      email,
      password 
    }
    axios
    .post(`${process.env.REACT_APP_BACKEND_HOST}/users/login`,user,config)
    .then(res => {
      const {message} = res.data
      localStorage.setItem("token", message);
    })
    .catch(er => {
      const {message} = er.response.data
      setError(message)
    });
  }

  
  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="Material Kit React"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form} onSubmit={submit}>
                  <h2 className={classes.divider} style={{"color" : "#9c27b0"}}>Sign in</h2>
                  {
                        error === '' ? '' : 
                        <h4 style={{textAlign: 'center', verticalAlign: 'middle', color:  '#f44336'}}>
                          {error}</h4>
            
                    }
                  <CardBody>
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      error = {email === '' ? false : !validateEmail(email)}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        value: email,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: handleChange
                        
                      }}
                    />
                    {
                        email === '' ? '' : !validateEmail(email) ? <Danger>
                          Your email is incorrect. Please check your spelling.
                          </Danger>  : ''
                    }
                    
                    <CustomInput
                      labelText="Password"
                      id="password"
                      error = {password === '' ? false : !validatePassword(password)}
                      
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        value: password,
                        endAdornment: (
                          <InputAdornment position="end">
                            
                            <LockOpenIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        onChange: handleChange
                      }}
                    />
                      {
                        password === '' ? '' : !validatePassword(password) ? <Danger>
                          Password must contain only lowercase letters, uppercase letters and numbers! Password must be at least 8 letters!
                          </Danger>  : ''
                    }
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple type='submit' color="primary" disabled={ email === '' ? (true) : (!validateEmail(email) ? (true) : (password === '' ? (true) : (!validatePassword(password) ? (true) : (false)) ))} size="lg">
                      Get started
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
