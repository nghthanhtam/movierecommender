import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Face from "@material-ui/icons/Face";
import RateReviewIcon from "@material-ui/icons/RateReview";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import styles from "assets/jss/material-kit-react/views/componentsSections/pillsStyle.js";
import Button from "components/CustomButtons/Button.js";

const useStyles = makeStyles(styles);

export default function MovieDetails(props) {
  const classes = useStyles();
  const [details, setDetails] = useState(props.details);
  const [rating, setRating] = useState(props.details.rating);
  const [castlist, setCast] = useState([]);
  const changeRating = (newRating) => {
    setRating(newRating);
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/writecsv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: newRating, id: props.details.id }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
      });
  };

  useEffect(() => {
    let apiKey = "a1e04f21511bd27a683b88ebc97b8446";
    async function fetchData() {
      let api =
        "https://api.themoviedb.org/3/movie/" +
        props.details.id +
        "/credits?api_key=" +
        apiKey +
        "&language=en-US";
      const response = await fetch(api);
      const data = await response.json();
      let arrTemp = [];
      data.cast.map((el) => {
        arrTemp.push(el);
      });
      setCast(arrTemp);
    }
    fetchData();
  }, []);

  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <div id="navigation-pills">
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={10}>
              <NavPills
                color="info"
                horizontal={{
                  tabsGrid: { xs: 12, sm: 4, md: 4 },
                  contentGrid: { xs: 12, sm: 8, md: 8 },
                }}
                tabs={[
                  {
                    tabButton: "Overview",
                    tabIcon: Dashboard,
                    tabContent: (
                      <>
                        <span style={{ color: "white", fontSize: "17px" }}>
                          <h3>{details.title} </h3>
                          {details.overview ? details.overview : ""}
                          <br />
                        </span>
                        <div
                          styles={{
                            display: "inline-block",
                          }}
                        >
                          <div>
                            <Button color="info">+ Add to my list</Button>
                          </div>
                          <div>
                            <StarRatings
                              rating={rating}
                              changeRating={changeRating}
                              starSpacing="4px"
                              starDimension="20px"
                              starHoverColor="rgb(255,255,0)"
                              starRatedColor="rgb(255,255,0)"
                              numberOfStars={5}
                            />
                          </div>
                        </div>
                      </>
                    ),
                  },
                  {
                    tabButton: "Cast",
                    tabIcon: Face,
                    tabContent: (
                      <>
                        <span style={{ color: "white", fontSize: "17px" }}>
                          <h3> </h3>
                          The movie stars
                          {castlist[0] && castlist[0].name},
                          {castlist[1] && castlist[1].name},
                          {castlist[2] && castlist[2].name},{" "}
                          {castlist[3] && castlist[3].name},{" "}
                          {castlist[4] && castlist[4].name},{" "}
                          {castlist[5] && castlist[5].name} as the protagonists,
                          makes it achieve significant critical and commercial
                          success since its released day
                          <br />
                        </span>
                      </>
                    ),
                  },
                  {
                    tabButton: "More Info",
                    tabIcon: RateReviewIcon,
                    tabContent: (
                      <>
                        <h3>Release date: </h3>
                        <span style={{ color: "white", fontSize: "17px" }}>
                          {details.release_date}
                          <br />
                        </span>
                        <h3>Production companies: </h3>
                        {details.production_companies.map((com, index) => {
                          return (
                            <span
                              key={index}
                              style={{ color: "white", fontSize: "17px" }}
                            >
                              {com.name}
                              <br />
                            </span>
                          );
                        })}
                      </>
                    ),
                  },
                ]}
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
