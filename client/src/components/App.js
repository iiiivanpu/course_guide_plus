import React, { Component } from "react";
import WelcomePage from "./welcome-page";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  couseInfo = () => {
    return (
      <div>
        <h2>Course Info</h2>
      </div>
    );
  };

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/course_guide_plus/home">Home</Link>
            </li>
            <li>
              <Link to="/course_guide_plus/course_info">Course Info</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={WelcomePage} />
          <Route path="/course_info" component={this.couseInfo} />
        </div>
      </Router>
    );
  }
}

export default App;
