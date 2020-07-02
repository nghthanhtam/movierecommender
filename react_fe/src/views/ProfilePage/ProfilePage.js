import React, { useState, useEffect, useRef } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";
// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";

import profile from "assets/img/faces/christian.jpg";

import studio1 from "assets/img/examples/studio-1.jpg";
import studio2 from "assets/img/examples/studio-2.jpg";
import studio3 from "assets/img/examples/studio-3.jpg";
import studio4 from "assets/img/examples/studio-4.jpg";
import studio5 from "assets/img/examples/studio-5.jpg";
import work1 from "assets/img/examples/olu-eletu.jpg";
import work2 from "assets/img/examples/clem-onojeghuo.jpg";
import work3 from "assets/img/examples/cynthia-del-rio.jpg";
import work4 from "assets/img/examples/mariya-georgieva.jpg";
import work5 from "assets/img/examples/clem-onojegaw.jpg";
import styles from "assets/jss/material-kit-react/views/profilePage.js";
import axios from "axios";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Input from "../Components/Input.js";

// import validateEmail from "../../validation.js";
const useStyles = makeStyles(styles);

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function ProfilePage(props) {
  const [userInfo, setUserInfo] = useState({
    email: "",
    fullname: "",
    username: "",
    role: "",
  });
  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const handleCancel = () => {
    props.history.push("/home");
  };
  const prevUserInfo = usePrevious(userInfo);
  const classes = useStyles();

  const validateFullname = (name) => {
    return /^[a-zA-Z ]+$/.test(name);
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserInfo({ ...userInfo, [id]: value });
  };
  const handleSave = (e) => {
    const { id } = props.match.params;
    const { email, fullname, username, role } = userInfo;
    e.preventDefault();
    const user = {
      email,
      username,
      fullname,
      role,
    };
    axios
      .put(`${process.env.REACT_APP_BACKEND_HOST}/users/${id}`, user, config)
      .then((res) => {
        if (res.status === 200) setSuccess(res.data.message);
      })
      .catch((er) => {
        console.log(er);
        setError("User can not be updated right now!");
      });
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      const { id } = props.match.params;
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/users/${id}`,
        config
      );
      const { username, fullname, role, email } = result.data;
      setUserInfo({
        ...prevUserInfo,
        username,
        fullname,
        role,
        email,
      });
    };

    fetchData();
  }, []);

  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  return (
    <div>
      <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div>
                    <img src={profile} alt="..." className={imageClasses} />
                  </div>
                  <div className={classes.name}>
                    <h3 className={classes.title}>{userInfo.fullname}</h3>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
          </div>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <form className={classes.form} onSubmit={handleSave}>
                {success === "" ? (
                  ""
                ) : (
                  <h4
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      color: "#00FF00",
                    }}
                  >
                    {success}
                  </h4>
                )}
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
                    type="email"
                    input={userInfo.email}
                    classes={classes.inputIconsColor}
                    disabled
                  />

                  <Input
                    id="username"
                    labeltext="Username"
                    type="username"
                    input={userInfo.username}
                    classes={classes.inputIconsColor}
                    disabled
                  />

                  <Input
                    id="fullname"
                    labeltext="Fullname"
                    validation={validateFullname}
                    type="username"
                    handleChange={handleChange}
                    input={userInfo.fullname}
                    classes={classes.inputIconsColor}
                    errorText="Name must contain characters only!"
                  />
                  <Input
                    id="role"
                    labeltext="Role"
                    type="role"
                    input={userInfo.role}
                    classes={classes.inputIconsColor}
                    disabled
                  />
                </CardBody>
                <CardFooter className={classes.cardFooter}>
                  <Button
                    simple
                    type="submit"
                    color="primary"
                    // disabled={
                    //   email === ""
                    //     ? true
                    //     : !validateEmail(email)
                    //     ? true
                    //     : password === ""
                    //     ? true
                    //     : !validatePassword(password)
                    //     ? true
                    //     : false
                    // }
                    size="lg"
                  >
                    Save
                  </Button>
                  <Button
                    simple
                    type="submit"
                    color="primary"
                    onClick={handleCancel}
                    // disabled={
                    //   email === ""
                    //     ? true
                    //     : !validateEmail(email)
                    //     ? true
                    //     : password === ""
                    //     ? true
                    //     : !validatePassword(password)
                    //     ? true
                    //     : false
                    // }
                    size="lg"
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
