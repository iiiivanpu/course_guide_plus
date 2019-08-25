import { styled } from 'baseui';
import React, { Component } from 'react';
import MainPage from './pages/main-page';
import { updateIsMobile, selectAClass } from '../reducers/mainUi';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import UrlSync from './url-sync';
import backgroundImage from '../static/background.jpg';
import backgroundImageMin from '../static/background-min.jpg';
import { InlineShareButtons } from 'sharethis-reactjs';
import BackgroundImageOnLoad from 'background-image-on-load';
import { slide as Menu } from 'react-burger-menu';

const BackgroundContainer = styled('div', props => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: '0',
  top: '0',
  backgroundImage: `url(${
    props.$backgroundLoaded ? backgroundImage : backgroundImageMin
  })`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  fontFamily: 'Arial, Helvetica, sans-serif',
  overflow: props.$courseSelected ? 'auto' : 'hidden',
}));
const TopbarContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row-reverse',
  margin: '8px 25px 8px 0',
});
const TopbarElementContainer = styled('div', {
  color: 'white',
  fontSize: '18px',
  marginLeft: '50px',
  marginTop: '2px',
});
const linkStyle = {
  textDecoration: 'none',
  color: 'white',
};
const StyledAnchor = styled('div', {
  ':hover': {
    color: '#FFCB05',
  },
});
const SocialShareContainer = styled('div', {
  position: 'absolute',
  bottom: '30px',
  right: '40px',
  display: 'flex',
  alignItems: 'center',
});
const SocialShareMessage = styled('div', {
  color: 'white',
  marginRight: '10px',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '14px',
  userSelect: 'none',
});
const footerStyle = {
  backgroundColor: '#003283',
  fontSize: '20px',
  color: 'white',
  padding: '10px',
  position: 'fixed',
  left: '0',
  right: '0',
  bottom: '0',
  height: '1px',
  width: '100%',
};

const headerStyle = {
  backgroundColor: '#003283',
  fontSize: '20px',
  color: 'white',
  position: 'fixed',
  left: '0',
  right: '0',
  top: '0',
  height: '35px',
  width: '100%',
};

const hamburgerMenuStyle = {
  bmBurgerButton: {
    color: 'white',
    backgroundColor: 'white',
    position: 'fixed',
    width: '25px',
    height: '20px',
    top: '5px',
    right: '10px',
  },
  bmBurgerBars: {
    background: '#373a47',
  },
  bmBurgerBarsHover: {
    background: '#a90000',
  },
  bmCrossButton: {
    // height: '30px',
    // width: '30px',
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
    overflow: 'hidden',
  },
  bmMorphShape: {
    fill: '#373a47',
  },
  bmItemList: {
    padding: '0.8em',
    display: 'flex',
    flexDirection: 'column',
  },
  bmItem: {
    display: 'inline-block',
    marginBottom: '10px',
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif',
    textDecoration: 'none',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.5)',
  },
};

function Footer({ children }) {
  return (
    <div>
      <div style={footerStyle}>{children}</div>
    </div>
  );
}

function Header({ children }) {
  return (
    <div>
      <div style={headerStyle}>{children}</div>
    </div>
  );
}

class App extends Component {
  state = {
    backgroundLoaded: false,
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);

    this.handleWindowSizeChange();
  }

  handleWindowSizeChange = () => {
    const isMobile = window.innerWidth <= 800;
    this.props.updateIsMobile(isMobile);
  };

  showSettings(event) {
    event.preventDefault();
  }

  renderFooter = courseSelected => {
    return courseSelected ? null : (
      <Footer>
        <SocialShareContainer>
          <SocialShareMessage>Share to Others</SocialShareMessage>
          <InlineShareButtons
            config={{
              color: 'social', // set the color of buttons (social, white)
              enabled: true, // show/hide buttons (true, false)
              labels: 'null', // button labels (cta, counts, null)
              language: 'en', // which language to use (see LANGUAGES)
              networks: [
                // which networks to include (see SHARING NETWORKS)
                'whatsapp',
                'linkedin',
                'messenger',
                'facebook',
                'wechat',
                'twitter',
              ],
              padding: 8, // padding within buttons (INTEGER)
              radius: 200, // the corner radius on each button (INTEGER)
              show_total: false,
              size: 30, // the size of each button (INTEGER)
              url: 'https://course-guide-plus.ml/', // (defaults to current url)
              description:
                'Course Guide Plus is an easier and faster way to find courses at the Unviersity of Michigan ', // (defaults to og:description or twitter:description)
              title: 'Course Guide Plus', // (defaults to og:title or twitter:title)
            }}
          />
        </SocialShareContainer>
      </Footer>
    );
  };

  renderHeader = courseSelected => {
    return (
      <Header>
        <Menu
          right
          styles={hamburgerMenuStyle}
          //customBurgerIcon={
          //            <img src={hamburgerMenuIcon} alt="Hamburger menu open icon" />
          //        }
          //      customCrossIcon={
          //      <img src={close} alt="Hamburger menu close button" />
          //  }
        >
          <a id="home" className="menu-item" href="/">
            Home
          </a>
          <a id="about" className="menu-item" href="/about">
            About
          </a>
          <a id="contact" className="menu-item" href="/contact">
            Contact
          </a>
          <a onClick={this.showSettings} className="menu-item--small" href="/">
            Settings
          </a>
        </Menu>
      </Header>
    );
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
    const { backgroundLoaded } = this.state;
    const { isMobile, courseSelected, selectAClass } = this.props;
    return (
      <React.Fragment>
        <UrlSync />
        <Router>
          <BackgroundContainer
            $backgroundLoaded={backgroundLoaded}
            $courseSelected={courseSelected}
          >
            <BackgroundImageOnLoad
              src={backgroundImage}
              onLoadBg={() =>
                this.setState({
                  backgroundLoaded: true,
                })
              }
              onError={err => console.log('error', err)}
            />
            {!isMobile && (
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
                    onClick={() => selectAClass(null)}
                    style={linkStyle}
                  >
                    <StyledAnchor>Home</StyledAnchor>
                  </Link>
                </TopbarElementContainer>
              </TopbarContainer>
            )}
            {!isMobile && <hr />}
            <Route exact path="/" component={MainPage} />
            <Route path="/about" component={this.About} />
            <Route path="/contact" component={this.Contact} />
          </BackgroundContainer>
        </Router>
        {isMobile
          ? this.renderHeader(courseSelected)
          : this.renderFooter(courseSelected)}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  courseSelected: state.selectedClass !== null,
  isMobile: state.isMobile,
});

const mapDispatchToProps = dispatch => ({
  updateIsMobile: isMobile => {
    dispatch(updateIsMobile(isMobile));
  },
  selectAClass: className => {
    dispatch(selectAClass(className));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
