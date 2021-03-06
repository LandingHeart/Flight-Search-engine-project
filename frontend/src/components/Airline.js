import React from "react";
import "./css-files/text.css";
// import "./css-files/page-style-def.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Animated } from "react-animated-css";

export default class Airline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: this.props.admin,
      airline: this.props.admin === null ? "" : this.props.admin.airline,
      all_flights: [],
      all_airlines: [],
      data: [],
      lastUpdated: ""
    };
  }

  componentDidMount() {
    if (this.props.user === null && this.props.admin === null) {
      this.props.history.push("/signin");
      return;
    }
    this.getData();

    this.interval = setInterval(() => this.getData(), 10000);
  }

  render() {
    const { admin, airline, all_airlines, data, lastUpdated } = this.state;

    return (
      <div>
        <div>
          <Animated
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={true}
            animationInOut="5s"
          >
            <div>
              {admin === null ? (
                <h1 style={{ color: "black", fontWeight: "bold" }}>Airlines</h1>
              ) : (
                <h1>{admin.airline} Admin</h1>
              )}

              <pre style={{ color: "black" }}>Last updated: {lastUpdated}</pre>
            </div>

            {admin === null ? (
              <div>
                <form onSubmit={this.handleSubmit}>
                  <label>
                    Choose airline :
                    <select value={airline} onChange={this.handleAirline}>
                      <option value=""></option>
                      {all_airlines.map(item => (
                        <option value={item.airline} key={item._id}>
                          {item.airline}
                        </option>
                      ))}
                    </select>
                  </label>
                </form>
              </div>
            ) : (
              <div>
                <Link
                  to={{
                    pathname: "/admin/add",
                    state: {
                      flight: { airline: this.state.airline },
                      type: "ADD"
                    }
                  }}
                >
                  Add Flight
                </Link>
              </div>
            )}

            <hr />

            <div
              className="container"
              style={{
                boxShadow: "0px 0.5px 2px 3px #ccc",
                border: "1px solid lightgray",
                backgroundColor: "#fff"
              }}
            >
              <table>
                <thead>
                  <tr>
                    <td>FLIGHT NAME</td>
                    <td>DEPARTURE</td>
                    <td>DESTINATION</td>
                    <td>DATE</td>
                    <td>TIME</td>
                    <td>FARE</td>
                    <td>CAPACITY</td>
                    <td>STATUS</td>
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item._id}>
                      <td>{item.flightname}</td>
                      <td>{item.depart}</td>
                      <td>{item.dest}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>${item.fares}</td>
                      <td>{item.capacity - item.filled}</td>
                      <td>{item.status}</td>

                      {admin === null ? (
                        item.isRegistered ? (
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() => this.cancel(item)}
                            >
                              Cancel Flights
                            </button>
                          </td>
                        ) : item.status === "CANCELLED" ||
                          item.capacity - item.filled <= 0 ? (
                          <td>CAN'T REGISTER</td>
                        ) : (
                          <td>
                            <Link
                              className="btn-success btn"
                              to={{
                                pathname: "/details",
                                state: {
                                  flight: item,
                                  type: "REGISTER",
                                  bookedFrom: "AIRLINE"
                                }
                              }}
                            >
                              Register
                            </Link>
                          </td>
                        )
                      ) : (
                        <td>
                          <span>
                            <Link
                              className="btn-success btn"
                              to={{
                                pathname: "/admin/add",
                                state: {
                                  flight: item,
                                  type: "EDIT"
                                }
                              }}
                            >
                              Edit Flight
                            </Link>
                            <Link
                              to={{
                                pathname: "/details",
                                state: {
                                  flight: item,
                                  type: "CANCEL"
                                }
                              }}
                            >
                              Cancel Flight
                            </Link>
                          </span>
                          <Link
                            to={{
                              pathname: "/admin/customerList",
                              state: {
                                flight: item,
                                type: "AIRLINE"
                              }
                            }}
                          >
                            See All Customer Reservation
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Animated>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getData = () => {
    const { admin } = this.state;
    if (admin !== null) {
      this.getDataAdmin();
    } else {
      this.getDataCustomer();
    }
  };

  search = airline => {
    if (airline === "") {
      this.setState({ data: [] });
      return;
    }
    const { all_flights } = this.state;
    const data = all_flights.filter(item =>
      item.airline.toLocaleLowerCase().includes(airline.toLocaleLowerCase())
    );

    this.setState({ data, airline });
  };

  async getDataAdmin() {
    try {
      const flights_json = await fetch("/flights");
      const flights_unfiltered = await flights_json.json();

      const airline_json = await fetch("/airlines");
      const all_airlines = await airline_json.json();
      const { airline } = this.state.admin;
      let airlineid = null;
      for (let currAirline of all_airlines) {
        if (currAirline.airline === airline) {
          airlineid = currAirline.airlineid;
          break;
        }
      }

      const all_flights_filtered = flights_unfiltered.filter(
        item => item.airlineid === airlineid
      );

      let data = [];
      if (this.state.admin === null) {
        const all_flights_today = all_flights_filtered.filter(
          item => new Date(item.date) - new Date(this.props.currentDate) >= 0
        );

        data = all_flights_today.sort(
          (a, b) =>
            new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
        );
      } else {
        data = all_flights_filtered.sort(
          (a, b) =>
            new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
        );
      }
      const lastUpdated = this.getCurrentTime();

      this.setState({ data, lastUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  async cancel(flight) {
    // const { user_booking } = this.state;
    const all_booking = await fetch("/bookings");
    const bookings = await all_booking.json();

    let booking = null;
    for (let curr_booking of bookings) {
      if (
        curr_booking.flightid === flight.flightid &&
        curr_booking.customer === this.props.user.customerid
      ) {
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
                this.props.history.push("/");
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  async getDataCustomer() {
    try {
      const booking_json = await fetch("/bookings");
      const booking = await booking_json.json();

      const my_booking = booking.filter(
        item => item.customer === this.props.user.customerid
      );
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

      const airline_json = await fetch("/airlines");
      const all_airlines = await airline_json.json();

      const lastUpdated = this.getCurrentTime();

      this.setState({ all_flights, all_airlines, lastUpdated });
    } catch (err) {
      console.log(err);
    }
  }

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

  handleAirline = e => {
    const airline = e.target.value;
    this.search(airline);
  };

  handleSubmit = e => {
    e.preventDefault();
  };
}
