import React, { useState, useEffect, Fragment } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { makeStyles } from "@material-ui/core/styles";
import styles1 from "assets/jss/material-kit-react/views/components.js";
import styles from "../../assets/css/scroll-pane.module.css";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import MovieList from "./MovieList.js";
import GenreDialog from "../Model/GenreDialog";

const useStyles = makeStyles(styles1);

function Home(props) {
  const classes = useStyles();
  const [list, setList] = useState([]);
  const [userGenre, setUserGenre] = useState("-1");
  const [isModelClose, setIsModelClose] = useState(false);
  const { query, payload } = props;
  const { firstTimeUse, fullname, id } = payload;

  useEffect(() => {
    if ((firstTimeUse && isModelClose) || firstTimeUse === false) {
      getRecommendedMovies(userGenre);
      // fetch(
      //   `${process.env.REACT_APP_BACKEND_HOST}/rec/` + userId + "/" + "-1"
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     let arrTemp = [];
      //     data.movie.map((el) => {
      //       //el.shift(); //bỏ phim đàu tiên đi, vì đó là phim dựa vào để recommend
      //       arrTemp.push(el);
      //     });
      //     setList(arrTemp);
      //     console.log(data.movie);
      //   });
    }

    // async function fetchData() {
    //   const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/rec`);
    //   const data = await response.json();
    //   let arrTemp = [];
    //   data.movie.map((el) => {
    //     //el.shift(); //bỏ phim đàu tiên đi, vì đó là phim dựa vào để recommend
    //     arrTemp.push(el);
    //   });
    //   setList(arrTemp);
    //   console.log(data.movie);
    // }
    // fetchData();
  }, []);

  useEffect(() => {
    //firstTimeUse && isModelClose: user dùng lần đầu và chọn xong
    //firstTimeUse === false: ko phải user dùng lần đầu
    // if ((firstTimeUse && isModelClose) || firstTimeUse === false) {
    //   if (query.length > 2) {
    //     getSearchedMovies();
    //   } else {
    //     if (query.length == 0) {
    //       getRecommendedMovies("-1");
    //     }
    //   }
    // }
  }, [query]);

  const onChangeRecList = (text) => {
    setUserGenre(text);
    getRecommendedMovies(text);
    setIsModelClose(true);
  };

  const getRecommendedMovies = (text) => {
    let idUser = 592;
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/rec/` + idUser + "/" + text)
      .then((res) => res.json())
      .then((data) => {
        let arrTemp = [];
        data.movie.map((el) => {
          //el.shift(); //bỏ phim đàu tiên đi, vì đó là phim dựa vào để recommend
          arrTemp.push(el);
        });
        setList([]);
        setList(arrTemp);
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
        setList([]);
        setList(arrTemp);
        console.log(data.result);
      });
  };

  return (
    <Fragment>
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
            );
          })}
        </div>
      </div>

      <GenreDialog
        open={firstTimeUse}
        onSave={onChangeRecList}
        id={id}
      ></GenreDialog>
    </Fragment>
  );
}
export default Home;
