import { styled } from 'baseui';
import React, { Component } from 'react';
import MainPage from './pages/main-page';
import { updateIsMobile, selectAClass } from '../reducers/mainUi';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import UrlSync from './url-sync';
import backgroundImage from '../static/background.jpg';

const BackgroundContainer = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: '0',
  top: '0',
  backgroundImage: `url(${backgroundImage})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  minWidth: '200px',
  fontFamily: 'Arial, Helvetica, sans-serif',
});
const TopbarContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row-reverse',
});
const TopbarElementContainer = styled('div', {
  color: 'white',
  fontSize: '30px',
  marginRight: '50px',
  marginTop: '7px',
});
const linkStyle = {
  textDecoration: 'none',
  color: 'white',
};
const StyledAnchor = styled('a', {
  ':hover': {
    color: '#FFCB05',
  },
});

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
    const isMobile = window.innerWidth <= 800;
    this.props.updateIsMobile(isMobile);
  };

  About = () => {
    return (
      <div>
        <h2>About</h2>
      </div>
    );
  };

  Contact = () => {
    return (
      <div>
        <h2>Contact</h2>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <UrlSync />
        <Router>
          <BackgroundContainer>
            <TopbarContainer>
              {/* Reverse the order because using row-reverse */}
              <TopbarElementContainer>
                <Link to="/contact" style={linkStyle}>
                  <StyledAnchor>Contact</StyledAnchor>
                </Link>
              </TopbarElementContainer>
              <TopbarElementContainer>
                <Link to="/about" style={linkStyle}>
                  <StyledAnchor>About</StyledAnchor>
                </Link>
              </TopbarElementContainer>

              <TopbarElementContainer>
                <Link
                  to="/"
                  onClick={() => this.props.selectAClass(null)}
                  style={linkStyle}
                >
                  <StyledAnchor>Home</StyledAnchor>
                </Link>
              </TopbarElementContainer>
            </TopbarContainer>
            <hr />

            <Route exact path="/" component={MainPage} />
            <Route path="/about" component={this.About} />
            <Route path="/contact" component={this.Contact} />
          </BackgroundContainer>
        </Router>
      </React.Fragment>
    );
  }
}

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
