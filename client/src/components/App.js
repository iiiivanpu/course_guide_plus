import React, { Component } from 'react';
import MainPage from './pages/main-page';
import { updateIsMobile } from '../reducers/mainUi';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  componentDidMount() {
    this.handleWindowSizeChange();
  }

  handleWindowSizeChange = () => {
    const isMobile = window.innerWidth <= 1000;
    this.props.updateIsMobile(isMobile);
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

// export default App;

const mapDispatchToProps = dispatch => ({
  updateIsMobile: isMobile => {
    dispatch(updateIsMobile(isMobile));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(App);
