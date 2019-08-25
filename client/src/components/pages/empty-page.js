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
const EmptyPageContainer = styled('div', props => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  // Offset for a more center look
  marginTop: props.$isMobile ? '-200px' : '-300px',
}));
const LogoContainer = styled('img', {
  marginBottom: '10px',
  userSelect: 'none',
  cursor: 'pointer',

  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
});
const SloganContainer = styled('div', props => ({
  userSelect: 'none',
  color: 'white',
  fontSize: props.$isMobile ? '16px' : '22px',
  marginBottom: '25px',
  textAlign: 'center',

  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
}));
const SearchBarContainer = styled('div', props => ({
  position: 'relative',
  width: props.$isMobile ? '110%' : '125%',
  userSelect: 'none',
}));

class EmptyPage extends React.Component {
  render() {
    const { isMobile } = this.props;
    return (
      <MainContainer $isMobile={isMobile}>
        <EmptyPageContainer $isMobile={isMobile}>
          <LogoContainer
            src={Logo}
            alt="website logo"
            onClick={() => this.props.selectAClass(null)}
            draggable="false"
            height={isMobile ? 52 : 70}
          />
          <SloganContainer $isMobile={isMobile}>
            Easier and Faster Way to Find your Courses
          </SloganContainer>
          <SearchBarContainer $isMobile={isMobile}>
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
