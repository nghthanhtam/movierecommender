import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import Footer from "components/Footer/Footer.js";
import React from "react";

import image from "assets/img/bg7.jpg";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
const useStyles = makeStyles(styles);

export default function Layout(props) {
  const {
    token,
    children,
    userLogout,
    userLogin,
    onQueryChange,
    ...rest
  } = props;
  const classes = useStyles();
  const location = useLocation();
  const { pathname } = location;
  const path = pathname === "/login" || pathname === "/signup" ? true : false;
  return (
    <div>
      {path ? (
        <Header
          brand="Material Kit React"
          userLogout={userLogout}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 400,
            color: "white",
          }}
          token={token}
          {...rest}
        />
      ) : (
        <Header
          brand="Material Kit React"
          rightLinks={
            <HeaderLinks
              changeColorOnScroll={{
                height: 400,
                color: "white",
              }}
              userLogout={userLogout}
              onQueryChange={onQueryChange}
            />
          }
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 400,
            color: "white",
          }}
          token={token}
          userLogin={userLogin}
          {...rest}
        />
      )}
      <div
        className={path ? classes.pageHeader : null}
        style={
          path
            ? {
                backgroundImage: "url(" + image + ")",
                backgroundSize: "cover",
                backgroundPosition: "top center",
              }
            : null
        }
      >
        {children}
        <Footer white={path ? true : false} />
      </div>
    </div>
  );
}
