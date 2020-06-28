/*eslint-disable*/
import React from "react";
import CustomInput from "components/CustomInput/CustomInput.js";

import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
// react components for routing our app without refresh
import { Link, BrowserRouter as Router } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload, Person } from "@material-ui/icons";
import Search from "@material-ui/icons/Search";

import stylesHeaderLink from "assets/jss/material-kit-react/components/headerLinksStyle.js";
const useStylesHeaderLink = makeStyles(stylesHeaderLink);
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const classesHeaderLink = useStylesHeaderLink();
  const { userLogout, onQueryChange } = props;
  const userLogoutInComp = (e) => {
    e.preventDefault();
    userLogout();
  };

  const handleChange = (e) => {
    onQueryChange(e.target.value);
    // setQuery(e.target.value);
    // if (e.target.value.length >= 3) getSearchedMovies();
    // else if (e.target.value === "") {
    //   getRecommendedMovies();
    // }
  };

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <div style={{ display: "inline-flex", margin: "-20px 30px 0px 0px" }}>
          <CustomInput
            handleChange={handleChange}
            changeColorOnScroll={{
              height: 400,
              color: "white",
            }}
            id="searchFilter"
            white
            inputRootCustomClasses={classesHeaderLink.inputRootCustomClasses}
            formControlProps={{
              className: classesHeaderLink.formControl,
            }}
            inputProps={{
              placeholder: "Title, genres",
              inputProps: {
                "aria-label": "Search",
                className: classesHeaderLink.searchInput,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        {/* <Button

          href="https://www.creative-tim.com/product/material-kit-react?ref=mkr-navbar"
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
          <CloudDownload className={classes.icons} /> Download
        </Button> */}
        {/* <CustomInput
          id="regular"
          inputProps={{
            placeholder: "Type, genre",
          }}
          formControlProps={{
            fullWidth: true,
          }}
          white
        /> */}
      </ListItem>

      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText="Account"
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
          }}
          buttonIcon={Person}
          dropdownList={[
            <Link to="/mylist" className={classes.dropdownLink}>
              My list
            </Link>,
            <Link to="/login" className={classes.dropdownLink}>
              Settings
            </Link>,
            <a
              href="#"
              target="_blank"
              className={classes.dropdownLink}
              onClick={userLogoutInComp}
            >
              Sign out
            </a>,
          ]}
        />
      </ListItem>
    </List>
  );
}
