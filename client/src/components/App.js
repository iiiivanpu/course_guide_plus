import React, { Component } from "react";
import WelcomePage from "./welcome-page";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  Home = () => {
    return (
      <div>
        <h2>Home</h2>
      </div>
    );
  };

  About = () => {
    return (
      <div>
        <h2>About</h2>
      </div>
    );
  };

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/course_info">About</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={WelcomePage} />
          <Route path="/course_info" component={this.About} />
        </div>
      </Router>
    );
  }
}

export default App;
