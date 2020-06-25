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
    console.log(props);
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/rec`);
      const data = await response.json();
      let arrTemp = [];
      data.movie.map((el) => {
        //el.shift(); //bỏ phim đàu tiên đi, vì đó là phim dựa vào để recommend
        arrTemp.push(el);
      });
      setList(arrTemp);
      //console.log(data.movie);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let { query } = props;
    if (query.length > 2) {
      getSearchedMovies();
    } else if (query.length == 0) {
      getRecommendedMovies();
    }
  }, [props.query]);

  const getRecommendedMovies = () => {
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/rec`)
      .then((res) => res.json())
      .then((data) => {
        let arrTemp = [],
          arrPanelTitleTemp = [];
        data.movie.map((el) => {
          //el.shift(); //bỏ phim đàu tiên đi, vì đó là phim dựa vào để recommend
          arrTemp.push(el);
        });
        setList([]);
        setList(arrTemp);
      });
  };

  const getSearchedMovies = () => {
    let api = "/search/" + props.query;
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
      <Parallax image={require("assets/img/bg4.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}></div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div styles={{ display: "block" }}>
        {list.map((similar_movies, index) => {
          return (
            <MovieList
              key={index}
              list={similar_movies}
              query={query == "" ? false : true}
            />
            //)
          );
        })}
      </div>
    </div>
  );
}
export default Home;
