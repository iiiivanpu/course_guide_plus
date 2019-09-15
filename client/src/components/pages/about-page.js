import { styled } from 'baseui';
import React from 'react';
import Logo from '../../static/logo.png';
import { selectAClass } from '../../reducers/mainUi';
import { connect } from 'react-redux';
import backgroundImage from '../../static/about-background.jpg';

const AboutPageContainer = styled('div', props => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  top: '40px',
}));
const BackgroundContainer = styled('div', {
  top: '-100px',
  right: '0',
  left: '0',
  bottom: '0',
  position: 'absolute',
  backgroundColor: '#14274A',
});
const LogoSearchBarContainer = styled('div', {
  top: '-43px',
  left: '50px',
  position: 'absolute',
  overflow: 'none',
  // Fix the search bar to prevent change to width
  maxWidth: '638px',
  zIndex: '10000',
});
const LogoContainer = styled('img', {
  width: '50%',
  userSelect: 'none',
  cursor: 'pointer',
});
const Mission = styled('div', {
  width: '100%',
  backgroundColor: 'white',
  zIndex: '1',
  color: '#14274A',
});
const MissionContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '50px',
  marginTop: '50px',
  marginBottom: '50px',
});
const MissionTitle = styled('div', {
  fontSize: '30px',
  marginBottom: '20px',
});
const MissionContent = styled('div', { width: '50%' });
const Team = styled('div', {
  width: '100%',
  //   backgroundColor: 'blue',
  backgroundImage: `url(${backgroundImage})`,
  backgroundColor: 'rgb'
  zIndex: '1',
  color: 'white',
});
const TeamContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '50px',
  marginTop: '50px',
  marginBottom: '50px',
});
const TeamTitle = styled('div', {
  fontSize: '30px',
  //   marginBottom: '20px',
  //   left: '50%',
  margin: 'auto',
  marginTop: '-20px',
  paddingBottom: '20px',
});
const TeamContent = styled('div', { width: '50%' });

class AboutPage extends React.Component {
  state = {
    courseName: null,
    courseInfo: null,
    loading: true,
    courseExists: false,
  };

  render() {
    return (
      <AboutPageContainer $isMobile={this.props.isMobile}>
        <BackgroundContainer />
        <LogoSearchBarContainer>
          <LogoContainer
            src={Logo}
            alt="website logo"
            // Add timeout to make it less abrupt
            onClick={() => setTimeout(() => this.props.selectAClass(null), 250)}
            draggable="false"
          />
        </LogoSearchBarContainer>
        <Mission>
          <MissionContainer>
            <MissionTitle>OUR MISSION</MissionTitle>
            <MissionContent>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in
              vehicula lacus, quis vulputate arcu. Maecenas ex risus, sodales
              quis erat ut, faucibus maximus dolor. Maecenas vel luctus purus.
              Vestibulum convallis tellus finibus aliquam vulputate. Sed posuere
              tincidunt efficitur. Cras blandit auctor ullamcorper. Ut id
              commodo massa. Etiam felis turpis, ultrices at suscipit accumsan,
              efficitur et velit. Maecenas ut massa vitae nulla euismod sodales.
              Ut turpis est, efficitur ut pretium interdum, ornare quis augue.
              Suspendisse sodales nisi orci, at condimentum massa tempor ut.
              Suspendisse potenti. Quisque tincidunt rhoncus ornare. Mauris sed
              magna ipsum. Praesent viverra sit amet nisl eu pellentesque. Etiam
              vel lacinia turpis. Aenean vel erat eu justo suscipit facilisis
              vel vitae sem. Fusce nec diam diam. In augue ligula, eleifend a
              vehicula vel, pellentesque non leo. Maecenas feugiat nisl eu eros
              ultricies, aliquam porttitor diam sagittis. Phasellus vitae tellus
              eleifend, iaculis elit in, condimentum lacus. Phasellus sed ipsum
              vitae enim convallis volutpat. Etiam congue metus quam, eleifend
              lacinia nisl aliquet ac. Curabitur ipsum lorem, porta nec tempor
              vitae, imperdiet a ipsum. Aliquam erat volutpat. Cras tempus ex eu
              risus pellentesque mattis. Etiam mattis arcu vitae lacus malesuada
              imperdiet. Aenean quis ipsum mi.
            </MissionContent>
          </MissionContainer>
        </Mission>
        <Team>
          <TeamContainer>
            <TeamTitle>THE TEAM</TeamTitle>
            <TeamContent>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in
              vehicula lacus, quis vulputate arcu. Maecenas ex risus, sodales
              quis erat ut, faucibus maximus dolor. Maecenas vel luctus purus.
              Vestibulum convallis tellus finibus aliquam vulputate. Sed posuere
              tincidunt efficitur. Cras blandit auctor ullamcorper. Ut id
              commodo massa. Etiam felis turpis, ultrices at suscipit accumsan,
              efficitur et velit. Maecenas ut massa vitae nulla euismod sodales.
              Ut turpis est, efficitur ut pretium interdum, ornare quis augue.
              Suspendisse sodales nisi orci, at condimentum massa tempor ut.
              Suspendisse potenti. Quisque tincidunt rhoncus ornare. Mauris sed
              magna ipsum. Praesent viverra sit amet nisl eu pellentesque. Etiam
              vel lacinia turpis. Aenean vel erat eu justo suscipit facilisis
              vel vitae sem. Fusce nec diam diam. In augue ligula, eleifend a
              vehicula vel, pellentesque non leo. Maecenas feugiat nisl eu eros
              ultricies, aliquam porttitor diam sagittis. Phasellus vitae tellus
              eleifend, iaculis elit in, condimentum lacus. Phasellus sed ipsum
              vitae enim convallis volutpat. Etiam congue metus quam, eleifend
              lacinia nisl aliquet ac. Curabitur ipsum lorem, porta nec tempor
              vitae, imperdiet a ipsum. Aliquam erat volutpat. Cras tempus ex eu
              risus pellentesque mattis. Etiam mattis arcu vitae lacus malesuada
              imperdiet. Aenean quis ipsum mi.
            </TeamContent>
          </TeamContainer>
        </Team>
      </AboutPageContainer>
    );
  }
}

const mapStateToProps = state => ({
  courseName: state.selectedClass,
  isMobile: state.isMobile,
});

const mapDispatchToProps = dispatch => ({
  selectAClass: className => {
    dispatch(selectAClass(className));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutPage);
