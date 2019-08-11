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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={MainPage} />
          <Route path="/about" component={this.About} />
        </div>
      </Router>
    );
  }
}

export default App;
