import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Animated } from "react-animated-css";

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const linkStyle = {
      color: "#fff",
      textDecoration: "none"
    };

    const headerStyle = {
      background: "#333",
      color: "white",
      textAlign: "center",
      padding: "10px"
    };

    if (this.props.admin !== null) {
      return (
        <header style={headerStyle}>
          <Animated
            animationIn="bounceInLeft"
            animationOut="fadeOut"
            isVisible={true}
          >
            <h1>Flights</h1>
          </Animated>
          <Link style={linkStyle} to="/">
            Home
          </Link>
          <Space />
          <React.Fragment>
            {this.props.admin.airline === "SEARCH" ? (
              <Link style={linkStyle} to="/reserve">
                Reserve
              </Link>
            ) : (
              <Link style={linkStyle} to="/airline">
                Airline
              </Link>
            )}
            <Space />

            <Link style={linkStyle} to="/airport">
              Airport
            </Link>
            <Space />

            <Link style={linkStyle} to="/admin/addAirport">
              Add Airport
            </Link>

            <Space />

            <Link
              style={linkStyle}
              to="/"
              onClick={() => {
                this.props.setAdmin(null);
                this.props.setUser(null);
              }}
            >
              Log out
            </Link>
          </React.Fragment>
        </header>
      );
    }

    //IF USER LOGGED IN
    if (this.props.user !== null) {
      return (
        <header style={headerStyle}>
          <Animated
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={true}
            animationInOut="2s"
          >
            <h1>Flights</h1>
            <Link style={linkStyle} to="/">
              Home
            </Link>
            <Space />
            <React.Fragment>
              <Link style={linkStyle} to="/reserve">
                Reserve
              </Link>
              <Space />
              <Link style={linkStyle} to="/airline">
                Airline
              </Link>
              <Space />
              <Link style={linkStyle} to="/airport">
                Airport
              </Link>
              <Space />
              <Link style={linkStyle} to="/profile">
                Profile
              </Link>
              <Space />
              <Link
                style={linkStyle}
                to="/"
                onClick={() => {
                  this.props.setAdmin(null);
                  this.props.setUser(null);
                }}
              >
                Log out
              </Link>
            </React.Fragment>
          </Animated>
        </header>
      );
    }

    //IF NOBODY LOGGED IN
    return (
      <header style={headerStyle}>
        <h1>Flights</h1>
        <Link style={linkStyle} to="/">
          Home
        </Link>
        <Space />
        <React.Fragment>
          <Link style={linkStyle} to="/signin">
            Sign In
          </Link>
          <Space />

          <Link style={linkStyle} to="/signup">
            Sign Up
          </Link>
        </React.Fragment>
      </header>
    );
  }
}

function Space() {
  return <span> | </span>;
}
