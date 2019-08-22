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
const EmptyPageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  // Offset for a more center look
  marginTop: '-320px',
});
const LogoContainer = styled('img', {
  marginBottom: '10px',
  userSelect: 'none',
  cursor: 'pointer',

  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
});
const SloganContainer = styled('div', {
  userSelect: 'none',
  color: 'white',
  fontSize: '20px',
  marginBottom: '30px',
  textAlign: 'center',

  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
});
const SearchBarContainer = styled('div', {
  position: 'aboluste',
  width: '120%',
  userSelect: 'none',
});

class EmptyPage extends React.Component {
  render() {
    return (
      <MainContainer $isMobile={this.props.isMobile}>
        <EmptyPageContainer>
          <LogoContainer
            src={Logo}
            alt="website logo"
            onClick={() => this.props.selectAClass(null)}
            draggable="false"
            height={70}
          />
          <SloganContainer>
            Easier and Faster Way to Find your Courses
          </SloganContainer>
          <SearchBarContainer>
            <SearchBar />
          </SearchBarContainer>
        </EmptyPageContainer>
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
