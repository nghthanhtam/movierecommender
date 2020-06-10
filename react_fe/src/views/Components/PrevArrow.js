import React, { Component } from "react";
import Button from "@material-ui/core/Button";

class PrevArrow extends Component {
  constructor(props) {
    super(props);
    //this.onChange = this.onChange.bind(this);
    this.state = {};
  }

  render() {
    return <Button variant="contained">Default</Button>;
  }
}
export default PrevArrow;
