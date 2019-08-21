import { styled } from 'baseui';
import React from 'react';
import Logo from '../../static/logo.png';
import SearchBar from '../search-bar';
import { selectAClass } from '../../reducers/mainUi';
import { connect } from 'react-redux';

const MainContainer = styled('div', {
  position: 'absolute',
  left: '0',
  // Offset to avoid covering up topbar
  height: '90%',
  top: '10%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
const WelcomePageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  // Offset a bit for a better look
  marginTop: '-400px',
});
const LogoContainer = styled('img', {
  marginBottom: '30px',
  width: '70%',
  userSelect: 'none',
  cursor: 'pointer',
});
const SearchBarContainer = styled('div', {
  position: 'aboluste',
  width: '90%',
  userSelect: 'none',
});

class EmptyPage extends React.Component {
  render() {
    return (
      <MainContainer
        $isMobile={this.props.isMobile}
        onClick={() => console.log('test')}
      >
        <WelcomePageContainer>
          <LogoContainer
            src={Logo}
            alt="website logo"
            onClick={() => this.props.selectAClass(null)}
            draggable="false"
          />
          <SearchBarContainer>
            <SearchBar />
          </SearchBarContainer>
        </WelcomePageContainer>
      </MainContainer>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  selectAClass: className => {
    dispatch(selectAClass(className));
  },
});

const mapStateToProps = state => ({
  isMobile: state.isMobile,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmptyPage);
