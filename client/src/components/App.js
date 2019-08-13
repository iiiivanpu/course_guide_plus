import React, { Component } from "react";
import MainPage from "./pages/main-page";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
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
              <Link to="/course_guide_plus">Home</Link>
            </li>
            <li>
              <Link to="/course_guide_plus/about">About</Link>
            </li>
          </ul>
          <hr />

          <Route exact path="/course_guide_plus" component={MainPage} />
          <Route path="/course_guide_plus/about" component={this.About} />
        </div>
      </Router>
    );
  }
}

export default App;
