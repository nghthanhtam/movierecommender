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
import ParallaxSmall from "../../components/Parallax/ParallaxSmall.js";

const useStyles = makeStyles(styles1);
const useStylesHeaderLink = makeStyles(stylesHeaderLink);

function MyList(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const [list, setList] = useState([]);
  // const [list, setList] = useState([
  //   {
  //     type: "search",
  //     movie_data: [
  //       { id: 862 },
  //       { id: 884 },
  //       { id: 1562 },
  //       { id: 31357 },
  //       { id: 11862 },
  //       { id: 949 },
  //       { id: 9087 },
  //     ],
  //   },
  // ]);

  const [query, setQuery] = useState("");

  useEffect(() => {
    let userId = 592;
    async function fetchData() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/watchlist/` + userId
      );
      const data = await response.json();
      let arrTemp = [];
      data.map((el, index) => {
        arrTemp.push({ id: el.movieId });
      });

      setList([]);
      setList((list) => [{ type: "search", movie_data: arrTemp }, ...list]);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.mylist}>
      {!(list.length > 0) ? (
        <div styles={{ height: "200px" }}></div>
      ) : (
        <>
          <ParallaxSmall
            image={require("assets/img/greybg.jpg")}
          ></ParallaxSmall>
          <div styles={{ display: "block" }}>
            <div styles={{ height: "100%" }}></div>
            {list.map((similar_movies, index) => {
              return (
                <MovieList
                  key={index}
                  list={similar_movies}
                  query={query == "" ? false : true}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
export default MyList;
