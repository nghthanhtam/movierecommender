import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Person } from "@material-ui/icons";
import Search from "@material-ui/icons/Search";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import styles1 from "assets/jss/material-kit-react/views/components.js";
import styles from "../../assets/css/scroll-pane.module.css";
import stylesHeaderLink from "assets/jss/material-kit-react/components/headerLinksStyle.js";

import CustomInput from "components/CustomInput/CustomInput.js";
//import Button from "components/CustomButtons/Button.js";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import MovieList from "./MovieList.js";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(styles1);
const useStylesHeaderLink = makeStyles(stylesHeaderLink);

function Home(props) {
  const classes = useStyles();
  const classesHeaderLink = useStylesHeaderLink();
  const { ...rest } = props;
  //const [listPaneTitle, setListPaneTitle] = useState([]);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/rec`);
      const data = await response.json();
      let arrTemp = [];
      data.movie.map((el) => {
        //arrPanelTitleTemp.push(el[0].title);
        //el.shift(); //bỏ phim đàu tiên đi, vì đó là phim dựa vào để recommend
        arrTemp.push(el);
      });
      setList(arrTemp);
      //setListPaneTitle(arrPanelTitleTemp);
      console.log(data.movie);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length >= 3) getSearchedMovies();
    else if (e.target.value === "") {
      getRecommendedMovies();
    }
  };

  const getRecommendedMovies = () => {
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/rec`)
      .then((res) => res.json())
      .then((data) => {
        let arrTemp = [],
          arrPanelTitleTemp = [];
        data.movie.map((el) => {
          //arrPanelTitleTemp.push(el[0].title);
          //el.shift(); //bỏ phim đàu tiên đi, vì đó là phim dựa vào để recommend
          arrTemp.push(el);
        });
        setList([]);
        setList(arrTemp);
        //setListPaneTitle(arrPanelTitleTemp);
      });
  };

  const getSearchedMovies = () => {
    let api = "/search/" + query;
    fetch(`${process.env.REACT_APP_BACKEND_HOST}` + api)
      .then((res) => res.json())
      .then((data) => {
        let arrTemp = [];
        data.result.map((el) => {
          arrTemp.push(el);
        });
        //setListPaneTitle([]);
        setList([]);
        setList(arrTemp);
        console.log(data.result);
      });
  };

  return (
    <div className={styles.bodyListMovie}>
      <Header
        brand="Material Kit React"
        rightLinks={
          <List className={classesHeaderLink.list}>
            <ListItem className={classesHeaderLink.listItem}>
              <div
                style={{ display: "inline-flex", margin: "-20px 30px 0px 0px" }}
              >
                <CustomInput
                  handleChange={handleChange}
                  white
                  inputRootCustomClasses={
                    classesHeaderLink.inputRootCustomClasses
                  }
                  formControlProps={{
                    className: classesHeaderLink.formControl,
                  }}
                  inputProps={{
                    placeholder: "Title, genres",
                    inputProps: {
                      "aria-label": "Search",
                      className: classesHeaderLink.searchInput,
                    },
                  }}
                />
                {/* <div style={{ padding: "20px 0px 0px 0px" }}>
                  <Button justIcon round color="white">
                    <Search className={classesHeaderLink.searchIcon} />
                  </Button>
                </div> */}
              </div>
            </ListItem>

            <ListItem className={classesHeaderLink.listItem}>
              <CustomDropdown
                noLiPadding
                buttonText="Account"
                buttonProps={{
                  className: classesHeaderLink.navLink,
                  color: "transparent",
                }}
                buttonIcon={Person}
                dropdownList={[
                  <Link to="/" className={classesHeaderLink.dropdownLink}>
                    Settings
                  </Link>,
                  <a className={classesHeaderLink.dropdownLink}>Sign out</a>,
                ]}
              />
            </ListItem>
          </List>
        }
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />

      <Parallax image={require("assets/img/bg4.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}></div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      {/* <div className={classNames(classes.main, classes.mainRaised)}> */}
      <div styles={{ display: "block" }}>
        {/* <MovieList list={this.state.list[0]} paneTitle="Trending now" />; */}
        {list.map((similar_movies, index) => {
          // let paneTitle = listPaneTitle[index] ? listPaneTitle[index] : "";
          return (
            // similar_movies[index] &&
            // listPaneTitle[index] && (
            <MovieList
              key={index}
              list={similar_movies}
              //paneTitle={listPaneTitle[index]}
              query={query == "" ? false : true}
            />
            //)
          );
        })}
      </div>
      {/* </div> */}
      <Footer />
    </div>
  );
}
export default Home;
