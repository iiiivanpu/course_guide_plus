import React, { Component } from 'react';
import MainPage from './pages/main-page';
import { updateIsMobile, selectAClass } from '../reducers/mainUi';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import UrlSync from './url-sync';

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
    const isMobile = window.innerWidth <= 700;
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
      <React.Fragment>
        <UrlSync />
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/" onClick={() => this.props.selectAClass(null)}>
                  Home
                </Link>
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
      </React.Fragment>
    );
  }

  // render() {
  //   return <MainPage />;
  // }
}

// export default App;

const mapDispatchToProps = dispatch => ({
  updateIsMobile: isMobile => {
    dispatch(updateIsMobile(isMobile));
  },
  selectAClass: className => {
    dispatch(selectAClass(className));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(App);
