import React, { Component, Fragment } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/css/scroll-pane.module.css";
import styles1 from "assets/jss/material-kit-react/views/components.js";
import axios from "axios";
import MovieDetails from "./MovieDetails";
//import { FaAngleDown } from "react-icons/fa";

class MovieList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.onChaonOpenDetClicknge = this.onOpenDetClick.bind(this);
    this.addToMyList = this.addToMyList.bind(this);
    this.state = {
      settings: {
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 4,
        //arrows: false,
        accessibility: true,
      },
      listMovie: [],
      poster_path: "",
      isOpenDetails: false,
      details: {
        id: "",
        overview: "",
        title: "",
        rating: 0,
        release_date: "",
        production_companies: [],
      },
      classes: makeStyles(styles1),
    };
  }

  addToMyList = (e, movieId) => {
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let favMovie = {
      userId: 592,
      movieId: movieId,
    };
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_HOST}/watchlists`,
        favMovie,
        config
      )
      .then((res) => {
        const { message } = res.data;
      })
      .catch((er) => {
        const { message } = er.response.data;
      });
  };

  onOpenDetClick = (event, movieId) => {
    let { isOpenDetails, listMovie } = this.state;
    let value = isOpenDetails ? false : true,
      movie = listMovie.find((movie) => movie.id === movieId);

    //adding user-clicking points
    this.setState({ isOpenDetails: value }, () => {
      if (isOpenDetails === true) return;
      fetch(`${process.env.REACT_APP_BACKEND_HOST}/writecsv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: -2, id: movieId, userid: 592 }),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          //console.log(json);
        });
    });
    //adding user-clicking points

    if (value) this.myRef.current.scrollIntoView({ behavior: "smooth" });

    this.setState((prevState) => ({
      details: {
        ...prevState.details,
        overview: movie.overview,
        title: movie.title,
        rating: movie.rating,
        id: movieId,
        release_date: movie.release_date,
        production_companies: movie.production_companies,
      },
    }));
  };

  componentDidMount() {
    let { list } = this.props,
      apiKey = "a1e04f21511bd27a683b88ebc97b8446",
      panelTitle = "",
      splitText = "";
    console.log(list);
    if (list.length === 0) return;
    this._isMounted = true;

    if (list.type.includes("|")) {
      splitText = list.type.split("|");
      list.type = splitText[0];
    }
    if (list.type === "recommend") {
      panelTitle = "Because You Liked " + list.movie_data[0].title;
      list.movie_data.shift();
    } else if (list.type === "popular") {
      panelTitle = "Popular Movies For You";
    } else if (list.type === "colla") {
      panelTitle = "You May Also Like";
    } else if (list.type === "genres") {
      panelTitle = "Popular " + splitText[1] + " Shows";
    }
    this.setState({ panelTitle: panelTitle });
    let count = 0;
    list.movie_data.map((item) => {
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
            rating: item.rating % 1 == 0 ? item.rating : 0,
            title: data.title,
            posterPath: data.poster_path,
            overview: data.overview,
            genres: data.genres,
            release_date: data.release_date,
            production_companies: data.production_companies,
          };
          if (this._isMounted) {
            count++;
            this.setState(
              {
                listMovie: [...this.state.listMovie, movie],
              },
              function () {
                //   if (count === list.movie_data.length && count < 7) {
                //   let obj = {
                //     id: "",
                //     rating: 0,
                //     title: "",
                //     posterPath: "",
                //     overview: "",
                //     genres: [],
                //     release_date: "",
                //     production_companies: "",
                //   };
                //   let temp = this.state.listMovie;
                //   for (let i = 0; i < 7 - count; i++) {
                //     temp.push(obj);
                //   }
                //   this.setState({
                //     listMovie: temp,
                //   });
                // }
              }
            );
          }
        });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let {
      settings,
      listMovie,
      isOpenDetails,
      details,
      panelTitle,
    } = this.state;
    let { query } = this.props;
    let img_url = "https://image.tmdb.org/t/p/w200";
    return (
      <Fragment>
        <div className={styles.container}>
          <div
            style={{
              marginBottom: "15px",
              fontWeight: "bold",
              fontSize: "25px",
            }}
          >
            {!query && listMovie.length > 0 && <div> {panelTitle}</div>}
          </div>
          <Slider {...settings}>
            {listMovie.map((movie) => {
              return (
                <div key={movie.id} className={styles.box}>
                  {movie.id === "" ? (
                    <p>Blank</p>
                  ) : (
                    <>
                      <div
                        className={styles.icon}
                        style={{
                          backgroundImage:
                            "url(" + img_url + movie.posterPath + ")",
                        }}
                        ref={this.myRef}
                      ></div>

                      <IconButton
                        className={styles.plusbtn}
                        onClick={(e) => this.addToMyList(e, movie.id)}
                      >
                        <SvgIcon>
                          <path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM12.984 6.984v4.031h4.031v1.969h-4.031v4.031h-1.969v-4.031h-4.031v-1.969h4.031v-4.031h1.969z" />
                        </SvgIcon>
                      </IconButton>

                      <IconButton
                        className={styles.arrowbtn}
                        onClick={(e) => this.onOpenDetClick(e, movie.id)}
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

                      <div className={styles.content}>
                        <h3>{movie.title}</h3>
                        {movie.genres[0] && <> {movie.genres[0].name} </>}
                        {movie.genres[1] && <> • {movie.genres[1].name} </>}
                      </div>
                    </>
                  )}
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
      </Fragment>
    );
  }
}
export default MovieList;
