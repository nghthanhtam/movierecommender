import React, { Component, useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { makeStyles } from "@material-ui/core/styles";
import styles1 from "assets/jss/material-kit-react/views/components.js";
import styles from "../../assets/css/scroll-pane.module.css";
import stylesHeaderLink from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MovieList from "../HomePage/MovieList";

const useStyles = makeStyles(styles1);
const useStylesHeaderLink = makeStyles(stylesHeaderLink);

function MyList(props) {
  const classes = useStyles();
  const { ...rest } = props;
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

  return (
    <div></div>
    // <div className={styles.bodyListMovie}>
    //   {!similar_movies ? (
    //     <div styles={{ height: "500px" }}></div>
    //   ) : (
    //     <div styles={{ display: "block" }}>
    //       {list.map((similar_movies, index) => {
    //         return (
    //           <MovieList
    //             key={index}
    //             list={similar_movies}
    //             query={query == "" ? false : true}
    //           />
    //         );
    //       })}
    //     </div>
    //   )}
    // </div>
  );
}
export default MyList;
