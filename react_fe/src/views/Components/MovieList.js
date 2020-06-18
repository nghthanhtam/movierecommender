import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/css/scroll-pane.module.css";
import styles1 from "assets/jss/material-kit-react/views/components.js";

class MovieList extends Component {
  constructor() {
    super();
  }
  state = {
    settings: {
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 3,
    },
    classes: makeStyles(styles1),
  };

  componentDidMount() {}

  render() {
    let { settings } = this.state;
    let { movieList, paneTitle } = this.props;
    return (
      <div>
        <div className={styles.container}>
          <h2>{paneTitle}</h2>
          <Slider {...settings}>
            {movieList.map((movie) => {
              return (
                <div className={styles.box}>
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: movie.img_url,
                    }}
                  >
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </div>
                  <div className={styles.content}>
                    <h3>Search</h3>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </div>
                </div>
              );
            })}
          </Slider>
          <div className={styles.block}></div>
        </div>
      </div>
    );
  }
}
export default MovieList;
