import React from 'react';
import { styled } from 'baseui';
import { connect } from 'react-redux';
import EmptyPage from './empty-page';
import CourseInfoPage from './course-info-page';

const MainContainer = styled('div', props => ({
  fontFamily: 'Arial, Helvetica, sans-serif',
}));

class MainPage extends React.Component {
  render() {
    return (
      <MainContainer>
        {this.props.courseName === null ? <EmptyPage /> : <CourseInfoPage />}
      </MainContainer>
    );
  }
}

const mapStateToProps = state => ({
  courseName: state.selectedClass,
  isMobile: state.isMobile,
});

export default connect(
  mapStateToProps,
  null
)(MainPage);
