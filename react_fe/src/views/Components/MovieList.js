import React, { Component } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/css/scroll-pane.module.css";
import effects from "../../assets/css/appearing-effect.css";
import styles1 from "assets/jss/material-kit-react/views/components.js";
import MovieDetails from "./MovieDetails";
//import { FaAngleDown } from "react-icons/fa";

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.state = {
      settings: {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
      },
      listMovie: [],
      poster_path: "",
      isOpenDetails: false,
      details: { overview: "", title: "" },
      classes: makeStyles(styles1),
    };
  }

  onChange = (event, movieId) => {
    //this["879"].style.borderColor = "red";
    //this.myRef.current.setAttribute("style", "color:red");
    let value = this.state.isOpenDetails ? false : true,
      movie = this.state.listMovie.find((movie) => movie.id == movieId);

    this.setState({ isOpenDetails: value });
    if (value) this.myRef.current.scrollIntoView({ behavior: "smooth" });

    this.setState((prevState) => ({
      details: {
        ...prevState.details,
        overview: movie.overview,
        title: movie.title,
      },
    }));
  };

  componentDidMount() {
    let apiKey = "a1e04f21511bd27a683b88ebc97b8446";

    this.props.list.map((item) => {
      let api =
        "https://api.themoviedb.org/3/movie/" +
        item.id +
        "?api_key=" +
        apiKey +
        "&language=en-US";
      fetch(api)
        .then((res) => res.json())
        .then((data) => {
          let movie = {
            id: item.id,
            title: data.title,
            posterPath: data.poster_path,
            overview: data.overview,
            genres: data.genres,
          };

          this.setState({
            listMovie: [...this.state.listMovie, movie],
          });
        });
    });
  }

  render() {
    let { settings, listMovie, isOpenDetails, details } = this.state;
    let { paneTitle } = this.props;
    let img_url = "https://image.tmdb.org/t/p/w300";

    return (
      <>
        <div className={styles.container}>
          <h3>Because you liked {paneTitle}</h3>
          <Slider {...settings}>
            {listMovie.map((movie) => {
              return (
                <div key={movie.id} className={styles.box}>
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage:
                        "url(" + img_url + movie.posterPath + ")",
                    }}
                    ref={this.myRef}
                  ></div>

                  {/* <div onClick={this.onChange} className={styles.plusbtn}> */}
                  <div styles={{ display: "block" }}>
                    <IconButton
                      className={styles.arrowbtn}
                      onClick={(e) => this.onChange(e, movie.id)}
                    >
                      {isOpenDetails ? (
                        <SvgIcon>
                          <path d="M7.406 15.422l-1.406-1.406 6-6 6 6-1.406 1.406-4.594-4.594z" />
                        </SvgIcon>
                      ) : (
                        <SvgIcon>
                          <path d="M7.406 8.578l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z" />
                        </SvgIcon>
                      )}
                    </IconButton>
                    <IconButton className={styles.plusbtn}>
                      <SvgIcon>
                        <path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM12.984 6.984v4.031h4.031v1.969h-4.031v4.031h-1.969v-4.031h-4.031v-1.969h4.031v-4.031h1.969z" />
                      </SvgIcon>
                    </IconButton>
                  </div>

                  {/* </div> */}

                  <div className={styles.content}>
                    <h3>{movie.title}</h3>
                    <p>Horror - Comedy</p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
        <TransitionGroup component={null}>
          {isOpenDetails && (
            <CSSTransition classNames="dialog" timeout={700}>
              <div className={styles.details}>
                <MovieDetails details={details} />
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </>
    );
  }
}
export default MovieList;
