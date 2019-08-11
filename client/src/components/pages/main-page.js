import React from "react";
import { connect } from "react-redux";
import EmptyPage from "./empty-page";
import CourseInfoPage from "./course-info-page";

class MainPage extends React.Component {
  render() {
    console.log(this.props.courseName);
    return this.props.courseName === null ? <EmptyPage /> : <CourseInfoPage />;
  }
}

const mapStateToProps = state => ({
  courseName: state.selectedClass
});

export default connect(
  mapStateToProps,
  null
)(MainPage);
