import React, { Component, Fragment } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import SectionBasics from "./Sections/SectionBasics.js";
import Parallax from "components/Parallax/Parallax.js";
import styles1 from "assets/jss/material-kit-react/views/components.js";
import MovieList from "./MovieList.js";
class Home extends Component {
  state = {
    movie: "",
    movieList: [
      { img_url: "url(" + require("../../assets/img/movie1.jpg") + ")" },
      { img_url: "url(" + require("../../assets/img/movie2.jpg") + ")" },
      { img_url: "url(" + require("../../assets/img/movie3.jpg") + ")" },
      { img_url: "url(" + require("../../assets/img/movie4.png") + ")" },
      { img_url: "url(" + require("../../assets/img/movie5.jpg") + ")" },
      { img_url: "url(" + require("../../assets/img/movie6.jpg") + ")" },
    ],
    settings: {
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 3,
    },
    classes: makeStyles(styles1),
  };

  componentDidMount() {
    fetch("http://localhost:5000/rec")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.movie);
        this.setState({ movie: data.movie });
      });
  }

  render() {

    let { classes, movie, movieList } = this.state;

    return (
      <Fragment>
        <Parallax image={require("assets/img/bg4.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem>
                <div className={classes.brand}>
                  <h1 className={classes.title}>
                    A movie that you should watch
                  </h1>
                  <h3 className={classes.subtitle}>{movie}</h3>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>

        <div className={classNames(classes.main, classes.mainRaised)}>
          <div styles={{ display: "block" }}>
            <MovieList movieList={movieList} paneTitle="Trending now" />
            <MovieList
              movieList={movieList}
              paneTitle="Because you watched Money Heist"
            />
            <MovieList
              movieList={movieList}
              paneTitle="Because you watched Fruit Basket"
            />
            <MovieList
              movieList={movieList}
              paneTitle="Because you watched Avatar"
            />
          </div>
        </div>
        <SectionBasics />
      </Fragment>
    );
  }
}
export default Home;
