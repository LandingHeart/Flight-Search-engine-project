import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

export default class SignInAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      customers: [],
      permission: false
    };
  }
  componentDidMount() {}

  render() {
    const auth = this.props.auth;

    return (
      <div className="container">
        <div className="form-box">
          <h1>Admin Login</h1>
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleInputChange}
            />

            <input
              type="text"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />

            <input
              type="submit"
              value="Submit"
              className="btn"
              onClick={this.successLogin}
            />
          </form>
        </div>
      </div>
    );
  }

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    fetch("/admin/api/auth", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
<<<<<<< HEAD
          //go to admin page
=======
          //go to admin page 
>>>>>>> 9ed4c494ffd044fdf64237707c417ca72230a75d
          this.props.history.push("/airline");
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error logging in please try again");
      });
  };

  successLogin = event => {
    // this.props.history.push("/");
  };
}
