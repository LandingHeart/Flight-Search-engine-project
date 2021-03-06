import React from "react";
// import "./css-files/text.css";
// import "./css-files/page-style-def.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import "./css-files/search.css";
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_airports: [],
      all_flights: [],
      all_airlines: [],
      flights_showed: [],
      airline: "",
      departure: "",
      arrival: "",
      date: "null",
      dateString: "",
      price: "",
      lastUpdated: ""
    };
  }

  componentDidMount() {
    if (this.props.user === null && this.props.admin === null) {
      this.props.history.push("/signin");
      return;
    }

    this.fetchData();
    this.interval = setInterval(() => this.fetchData(), 20000);
  }

  render() {
    if (
      (this.props.user === null && this.props.admin === null) ||
      this.state.all_airlines === null ||
      this.state.all_flights === null ||
      this.state.all_airports === null
    )
      return null;

    const { admin } = this.props;
    const {
      flights_showed,
      all_airports,
      all_airlines,
      price,
      lastUpdated
    } = this.state;

    return (
      <div style={{ textAlign: "center" }}>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={true}
          animationInOut="2s"
        >
          <div>
            <h1 style={{ color: "black" }}>Search for a flight</h1>
            <pre style={{ color: "black" }}>Last updated: {lastUpdated}</pre>
          </div>

          <div className="mycontainer">
            <div style={{ backgroundColor: "#fff" }}>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <label className="row">
                    Airline name:
                    <div className="col" style={{ paddingLeft: "70px" }}>
                      <select
                        name="airline"
                        onChange={this.handleInputChange}
                        style={{ width: "100%" }}
                      >
                        <option value=""></option>
                        {all_airlines.map(item => (
                          <option value={item.airline} key={item._id}>
                            {item.airline}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="row">
                    Departure :
                    <div className="col" style={{ paddingLeft: "80px" }}>
                      <select
                        name="departure"
                        onChange={this.handleInputChange}
                        style={{ width: "80px" }}
                      >
                        <option value=""></option>
                        {all_airports.map(item => (
                          <option value={item.airports} key={item._id}>
                            {item.airports}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
                <div>
                  <label className="row">
                    Arrival :
                    <div className="col" style={{ paddingLeft: "105px" }}>
                      <select
                        name="arrival"
                        onChange={this.handleInputChange}
                        style={{ width: "80px" }}
                      >
                        <option value=""></option>
                        {all_airports.map(item => (
                          <option value={item.airports} key={item._id}>
                            {item.airports}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
                <div>
                  <label>
                    <input type="date" onChange={this.handleDate} />
                  </label>
                </div>
                <input type="submit" value="Submit" />
              </form>
            </div>
          </div>

          <div style={{ paddingTop: "20px", marginTop: "10px" }}>
            <div id="div-box">
              <h3>Result</h3>
              <form>
                <label>
                  Low to high
                  <input
                    type="radio"
                    value="LTH"
                    checked={price === "LTH"}
                    onChange={this.handlePrice}
                  />
                </label>
                &emsp;
                <label>
                  High to low
                  <input
                    type="radio"
                    value="HTL"
                    checked={price === "HTL"}
                    onChange={this.handlePrice}
                  />
                </label>
              </form>
            </div>
          </div>

          <div style={{ paddingTop: "30px" }}>
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
              <div>
                <table>
                  <thead>
                    <tr>
                      <td>FLIGHT NAME</td>
                      <td>DEPARTURE</td>
                      <td>DESTINATION</td>
                      <td>DATE</td>
                      <td>TIME</td>
                      <td>CAPACITY</td>
                      <td>FARE</td>
                      <td>STATUS</td>
                    </tr>
                  </thead>

                  <tbody>
                    {flights_showed.map(item => (
                      <tr key={item._id}>
                        <td>{item.flightname}</td>
                        <td>{item.depart}</td>
                        <td>{item.dest}</td>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>{item.capacity - item.filled}</td>
                        <td>${item.fares}</td>
                        <td>{item.status}</td>

                        {admin !== null ? (
                          admin.airline === "SEARCH" ? (
                            <Link
                              to={{
                                pathname: "/admin/customerList",
                                state: {
                                  flight: item,
                                  type: "SEARCH"
                                }
                              }}
                            >
                              See All Customer Reservation
                            </Link>
                          ) : null
                        ) : item.status === "ON TIME" ? (
                          item.isRegistered ? (
                            <td>REGISTERED</td>
                          ) : (
                            <td>
                              <Link
                                to={{
                                  pathname: "/details",
                                  state: {
                                    flight: item,
                                    type: "REGISTER",
                                    bookedFrom: "SEARCH"
                                  }
                                }}
                              >
                                Register
                              </Link>
                            </td>
                          )
                        ) : (
                          <td>UNAVAILABLE</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Animated>
      </div>
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async fetchData() {
    const flight_json = await fetch("/flights");
    const all_flights_unsorted = await flight_json.json();
    const all_flights_today = all_flights_unsorted.filter(
      item => new Date(item.date) - new Date(this.props.currentDate) >= 0
    );
    const all_flights_sorted = all_flights_today.sort(
      (a, b) =>
        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );

    let all_flights = [];

    if (this.props.user !== null) {
      const booking_json = await fetch("/bookings");
      const booking = await booking_json.json();
      const my_booking = booking.filter(
        item => item.customer === this.props.user.customerid
      );

      for (let flight of all_flights_sorted) {
        if (my_booking.length === 0) {
          all_flights.push(flight);
          continue;
        }
        for (let booking of my_booking) {
          if (booking.flightid === flight.flightid) {
            const obj = flight;
            obj["isRegistered"] = true;
            if (!all_flights.includes(obj)) {
              all_flights.push(obj);
            }
          } else {
            const obj = flight;
            if (!all_flights.includes(obj)) {
              all_flights.push(obj);
            }
          }
        }
      }
    } else {
      all_flights = all_flights_sorted;
    }

    const airline_json = await fetch("/airlines");
    const all_airlines = await airline_json.json();

    const airports_json = await fetch("/airports");
    const all_airports = await airports_json.json();
    const lastUpdated = this.getCurrentTime();

    this.setState({ all_airlines, all_airports, all_flights, lastUpdated });
  }

  search = () => {
    const { all_flights, airline, departure, arrival, dateString } = this.state;
    const flights_showed = [];

    all_flights.forEach(item => {
      if (
        item.airline === airline ||
        item.depart === departure ||
        item.dest === arrival ||
        item.date === dateString
      ) {
        flights_showed.push(item);
      }
    });
    this.setState({ flights_showed });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.search();
  };

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };

  handlePrice = e => {
    const price = e.target.value;
    const { flights_showed } = this.state;

    if (price === "HTL") flights_showed.sort((a, b) => b.fares - a.fares);
    else flights_showed.sort((a, b) => a.fares - b.fares);

    this.setState({ price, flights_showed });
  };

  handleDate = e => {
    const dateString = e.target.value;
    console.log(dateString);
    if (dateString.length === 0) {
      this.setState({ dateString: "" });
      return;
    }

    // const dateObject = new Date(date);
    // const dateString = this.convertDateToString(dateObject);
    this.setState({ dateString });
  };

  convertDateToString = dateObject => {
    const month = dateObject.getUTCMonth() + 1;
    const day = dateObject.getUTCDate();
    const year = dateObject.getUTCFullYear();
    const date = +month + "/" + day + "/" + year;
    return date;
  };

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
