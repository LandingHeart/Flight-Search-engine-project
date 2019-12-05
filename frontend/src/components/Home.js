import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Animated } from "react-animated-css";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flights: []
    };
  }
  componentDidMount() {
    fetch("/flights")
      .then(res => res.json())
      .then(flights => {
        this.setState({ flights });
        // console.log("flights fetch", flights);
      });
  }
  render() {
    return (
      <div>
        <label for="start" style={{ display: "block" }}>
          Start date:
        </label>

        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={true}
          animationInOut="2s"
        >
          {" "}
          <input
            type="date"
            id="start"
            name="trip-start"
            style={{
              display: "inline-block",
              width: "15%",
              height: "auto"
            }}
          ></input>
        </Animated>
      </div>
    );
  }

  handleChange = e => {
    const flights = e.target.value;
    console.log(flights);
    this.setState({ flights });
  };
}
