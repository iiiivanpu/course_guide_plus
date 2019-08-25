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
  // minWidth: props.$isMobile ? null : '1000px',
  fontFamily: 'Arial, Helvetica, sans-serif',
  overflow: 'auto',
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
const phantomStyle = {
  display: 'block',
  padding: '20px',
  height: '60px',
};

function Footer({ children }) {
  return (
    <div>
      <div style={phantomStyle} />
      <div style={footerStyle}>{children}</div>
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
          <BackgroundContainer
            $isMobile={this.props.isMobile}
            $backgroundLoaded={this.state.backgroundLoaded}
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
        {this.renderFooter(this.props.courseSelected)}
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
