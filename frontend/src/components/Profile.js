import React from "react";
import "./css-files/text.css";
import "./css-files/page-style-def.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      upcomingFlights: [],
      previousFlights: [],
      user_booking: [],
      lastUpdated: ""
    };
  }

  componentDidMount() {
    if (this.props.user === null) this.props.history.push("/signin");

    this.setFlight();
    this.interval = setInterval(() => this.setFlight(), 5000);
  }

  render() {
    const { user } = this.props;
    if (user === null) return null;

    const { upcomingFlights, previousFlights, lastUpdated } = this.state;

    return (
      <div className="container">
        <div>
          <h1 style={{ color: "black", fontWeight: "bold" }}>
            {user.firstname} Profile
          </h1>
          {/* <button onClick={this.refresh}>Refresh</button> */}
          <pre>Last updated: {lastUpdated}</pre>
        </div>
        <div className="div-box">
          <p>
            Name: {user.firstname} {user.lastname}
          </p>
          <p>Username: {user.username}</p>
        </div>
        <hr />
        <h2 style={{ color: "black" }}>UPCOMING</h2>
        <div
          className="container"
          style={{
            border: "1px solid grey",
            boxShadow: "0px 0.5px 2px 3px #ccc",
            textAlign: "center",
            width: "80%",
            right: "0",
            height: "auto",
            display: "inlineBlock",
            backgroundColor: "#fff"
          }}
        >
          <table>
            <thead>
              <tr>
                <td>FLIGHT</td>
                <td>AIRLINE</td>

                <td>DATE</td>
                <td>TIME</td>
                <td>DESTINATION</td>
                <td>DEPARTURE</td>
                <td>STATUS</td>
              </tr>
            </thead>

            <tbody>
              {upcomingFlights === null
                ? null
                : upcomingFlights.map(item => (
                    <tr key={item._id}>
                      <td>{item.flightname}</td>
                      <td>{item.airline}</td>

                      <td>{String(item.date)}</td>
                      <td>{item.time}</td>
                      <td>{item.dest}</td>
                      <td>{item.depart}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {/*<div>
          {upcomingFlights === null
            ? null
            : upcomingFlights.map(item => (
                <div key={item._id} className="div-box">
                  <p>Flight: {item.flightname}</p>
                  <p>Airline Name: {item.airline}</p>
                  <p>Date: {String(item.date)}</p>
                  <p>Time: {item.time}</p>
                  <p>Depart: {item.depart}</p>
                  <p>Destination: {item.dest}</p>

                  {/* 
                  <button
                    className="btn btn-success"
                    onClick={() => this.cancel(item)}
                  >
                    Cancel Flights
                  </button>
                */}

        <hr />
        <h2 style={{ color: "black" }}>Previous flights</h2>
        <div
          className="container"
          style={{
            border: "1px solid grey",
            boxShadow: "0px 0.5px 2px 3px #ccc",
            textAlign: "center",
            width: "80%",
            right: "0",
            height: "auto",
            display: "inlineBlock",
            backgroundColor: "#fff",
            marginBottom: "150px"
          }}
        >
          <table>
            <thead>
              <tr>
                <td>FLIGHT </td>
                <td>AIRLINE</td>

                <td>DATE</td>
                <td>TIME</td>
                <td>DESTINATION:</td>
                <td>DEPARTURE</td>
              </tr>
            </thead>

            <tbody>
              {previousFlights === null
                ? null
                : previousFlights.map(item => (
                    <tr key={item._id}>
                      <td>{item.flightname}</td>
                      <td>{item.airline}</td>
                      <td>{String(item.date)}</td>
                      <td>{item.time}</td>
                      <td>{item.dest}</td>
                      <td>{item.depart}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  cancel = flight => {
    const { user_booking } = this.state;
    let booking = null;
    for (let curr_booking of user_booking) {
      if (curr_booking.flightid === flight.flightid) {
        booking = curr_booking;
      }
    }

    fetch(`/bookings/${booking._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 200) {
          fetch(`/flights/updateSubsFilledIntoFlight/${flight.flightid}`, {
            method: "PUT",
            body: JSON.stringify(flight),
            headers: { "Content-Type": "application/json" }
          })
            .then(resp => {
              if (resp.status === 200) {
                alert("Success");
                this.props.history.push("/airline");
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  async setFlight() {
    try {
      //GET ALL BOOKINGS
      const bookings_json = await fetch("/bookings");
      const all_bookings = await bookings_json.json();

      const user_booking = all_bookings.filter(
        item => item.customer === this.props.user.customerid
      );

      //GET ALL FLIGHTS
      const flights_json = await fetch("/flights");
      const all_flights = await flights_json.json();

      //FILTER THE FLIGHT BASED ON BOOKING
      const flight = [];
      for (let i = 0; i < user_booking.length; i++) {
        const booking = user_booking[i];
        for (let j = 0; j < all_flights.length; j++) {
          const curr = all_flights[j];
          if (curr.flightid === booking.flightid) flight.push(curr);
        }
      }

      //FILTER THE FLIGHTS BASED ON THE DATES
      //TODO: NEED TO CHANGE new Date() WITH THE DATE USER INPUT
      const upcomingFlights = flight.filter(
        item => new Date(item.date) - new Date(this.props.currentDate) >= 0
      );

      const previousFlights = flight.filter(
        item => new Date(item.date) - new Date(this.props.currentDate) < 0
      );

      const lastUpdated = this.getCurrentTime();
      this.setState({
        upcomingFlights,
        previousFlights,
        lastUpdated,
        user_booking
      });
    } catch (e) {
      console.log(e);
    }
  }

  refresh = () => {
    window.location.reload(false);
  };

  // convert from date object to this format:
  // 12/05/2019 23:40:05
  getCurrentTime = () => {
    const now = new Date();
    const month = this.addZero(now.getMonth());
    const date = this.addZero(now.getDate());
    const year = now.getFullYear();
    const hour = this.addZero(now.getHours());
    const minutes = this.addZero(now.getMinutes());
    const seconds = this.addZero(now.getSeconds());

    return this.props.currentDate + " " + hour + ":" + minutes + ":" + seconds;
  };

  addZero = val => {
    return val < 10 ? "0" + val : val;
  };
}
