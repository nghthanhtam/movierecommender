import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import Footer from "components/Footer/Footer.js";
import React, { Fragment } from "react";

import image from "assets/img/bg7.jpg";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
const useStyles = makeStyles(styles);

export default function Layout(props) {
  const { token, children, userLogout, userLogin, ...rest } = props;
  const classes = useStyles();
  const location = useLocation();
  const { pathname } = location;
  return (
    <div>
      {pathname === "/login" ? (
        <Header
          brand="Material Kit React"
          userLogout={userLogout}
          rightLinks={(props) => (
            <HeaderLinks {...props} userLogout={userLogout} />
          )}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 400,
            color: "white",
          }}
          token={token}
          userLogout={userLogout}
          {...rest}
        />
      ) : (
        <Header
          brand="Material Kit React"
          rightLinks={<HeaderLinks userLogout={userLogout} />}
          absolute
          color="transparent"
          token={token}
          userLogin={userLogin}
          {...rest}
        />
      )}
      <div
        className={pathname === "/login" ? classes.pageHeader : null}
        style={
          pathname === "/login"
            ? {
                backgroundImage: "url(" + image + ")",
                backgroundSize: "cover",
                backgroundPosition: "top center",
              }
            : null
        }
      >
        {children}
        <Footer white={pathname === "/login" ? true : false} />
      </div>
    </div>
  );
}
