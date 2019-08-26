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
import { Collapse } from 'react-collapse';

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
    ':focus': {
      outline: 'none',
    },
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.5)',
  },
};
const inlineShareButtonsBaseConfig = {
  color: 'social', // set the color of buttons (social, white)
  enabled: true, // show/hide buttons (true, false)
  labels: 'null', // button labels (cta, counts, null)
  language: 'en', // which language to use (see LANGUAGES)
  padding: 8, // padding within buttons (INTEGER)
  radius: 200, // the corner radius on each button (INTEGER)
  show_total: false,
  size: 30, // the size of each button (INTEGER)
  url: 'https://course-guide-plus.ml/', // (defaults to current url)
  description:
    'Course Guide Plus is an easier and faster way to find courses at the Unviersity of Michigan ', // (defaults to og:description or twitter:description)
  title: 'Course Guide Plus', // (defaults to og:title or twitter:title)
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
    menuOpen: false,
    shareOpen: false,
  };

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen });
  }
  closeMenu() {
    this.setState({ menuOpen: false });
  }

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

  showShare() {
    this.setState(state => ({ shareOpen: !state.shareOpen }));
  }

  renderFooter = courseSelected => {
    return courseSelected ? null : (
      <Footer>
        <SocialShareContainer>
          <SocialShareMessage>Share to Others</SocialShareMessage>
          <InlineShareButtons
            config={{
              ...inlineShareButtonsBaseConfig,
              networks: [
                'whatsapp',
                'linkedin',
                'messenger',
                'facebook',
                'wechat',
                'twitter',
              ],
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
          isOpen={this.state.menuOpen}
          onStateChange={state => this.handleStateChange(state)}
          width={'60%'}
          right
          styles={hamburgerMenuStyle}
          disableAutoFocus
          //customBurgerIcon={
          //            <img src={hamburgerMenuIcon} alt="Hamburger menu open icon" />
          //        }
          //      customCrossIcon={
          //      <img src={close} alt="Hamburger menu close button" />
          //  }
        >
          <Link
            to="/"
            onClick={() => {
              selectAClass(null);
              this.closeMenu();
            }}
            style={linkStyle}
          >
            <StyledAnchor>Home</StyledAnchor>
          </Link>
          <Link to="/about" style={linkStyle} onClick={() => this.closeMenu()}>
            <StyledAnchor>About</StyledAnchor>
          </Link>
          <Link
            to="/contact"
            style={linkStyle}
            onClick={() => this.closeMenu()}
          >
            <StyledAnchor>Contact</StyledAnchor>
          </Link>
          <div onClick={() => this.showShare()}>Share</div>
          <Collapse isOpened={this.state.shareOpen}>
            <div style={{ marginBottom: '10px' }}>
              <InlineShareButtons
                config={{
                  ...inlineShareButtonsBaseConfig,
                  networks: ['whatsapp', 'linkedin', 'messenger'],
                }}
              />
            </div>
            <InlineShareButtons
              config={{
                ...inlineShareButtonsBaseConfig,
                networks: ['facebook', 'wechat', 'twitter'],
              }}
            />{' '}
          </Collapse>
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
          {isMobile
            ? this.renderHeader(courseSelected)
            : this.renderFooter(courseSelected)}
        </Router>
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
