import { styled } from 'baseui';
import React, { Component } from 'react';
import MainPage from './pages/main-page';
import { updateIsMobile, selectAClass } from '../reducers/mainUi';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import UrlSync from './url-sync';
import backgroundImage from '../static/background.jpg';
import { InlineShareButtons } from 'sharethis-reactjs';

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
  marginRight: '25px',
});
const TopbarElementContainer = styled('div', {
  color: 'white',
  fontSize: '25px',
  marginLeft: '50px',
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
const SocialShareContainer = styled('a', {
  position: 'absolute',
  bottom: '10px',
  right: '50px',
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
  backgroundColor: '#00274C',
  fontSize: '20px',
  color: 'white',
  padding: '20px',
  position: 'fixed',
  left: '0',
  right: '0',
  bottom: '0',
  height: '12px',
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

        <Footer>
          <SocialShareContainer>
            <SocialShareMessage>Share to Others</SocialShareMessage>
            <InlineShareButtons
              config={{
                alignment: 'right', // alignment of buttons (left, center, right)
                color: 'social', // set the color of buttons (social, white)
                enabled: true, // show/hide buttons (true, false)
                font_size: 16, // font size for the buttons
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
                padding: 12, // padding within buttons (INTEGER)
                radius: 20, // the corner radius on each button (INTEGER)
                show_total: false,
                size: 30, // the size of each button (INTEGER)

                // OPTIONAL PARAMETERS
                url: 'https://course-guide-plus.ml/', // (defaults to current url)
                //image: 'https://bit.ly/2CMhCMC', // (defaults to og:image or twitter:image)
                description:
                  'Course Guide Plus is an easier and faster way to find courses at the Unviersity of Michigan ', // (defaults to og:description or twitter:description)
                title: 'Course Guide Plus', // (defaults to og:title or twitter:title)
                //username: 'custom twitter handle', // (only for twitter sharing)
              }}
            />
          </SocialShareContainer>
        </Footer>
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
