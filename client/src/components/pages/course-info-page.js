import { styled } from "baseui";
import React from "react";
import Logo from "../../static/logo.png";
import SearchBar from "../serach-bar";
import { Spinner } from "baseui/spinner";

import { connect } from "react-redux";

const WelcomePageContainer = styled("div", {
  height: "20vh",
  display: "flex",
  flexDirection: "column",
  marginLeft: "30px",
  marginTop: "30px"
});
const LogoContainer = styled("img", {
  marginBottom: "30px",
  width: "30%"
});
const SearchBarContainer = styled("div", {
  width: "60%",
  marginBottom: "30px"
});
const ClassInfo = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  border: "1px solid grey",
  borderRadius: "10px",
  padding: "10px"
});
const ClassInfoLeft = styled("div", {
  flexGrow: "1",
  flexBasis: "0"
});
const ClassInfoRight = styled("div", {
  flexGrow: "1",
  flexBasis: "0"
});
const ClassInfoContainer = styled("div", {
  left: "20px",
  right: "20px",
  marginBottom: "30px"
});
const ClassInfoItem = styled("div", {
  display: "table",
  borderSpacing: "5px"
});
const ClassInfoItemBold = styled("div", {
  fontWeight: "bold",
  display: "table-cell"
});
const ClassInfoItemRegular = styled("div", {
  display: "table-cell"
});
const ClassTitle = styled("div", {
  color: "white",
  backgroundColor: "#2c3e6d",
  border: "1px solid grey",
  borderRadius: "10px",
  padding: "10px",
  display: "table",
  width: "auto",
  fontWeight: "bold",
  // Use max and min width to automatically adjust the width
  maxWidth: "100%",
  minWidth: "0"
});
const SectionTitle = styled("div", {
  backgroundColor: "#FFCB05",
  border: "1px solid grey",
  borderRadius: "10px"
});

class CourseInfoPage extends React.Component {
  state = {
    course: null,
    loading: true
  };

  fetchCourse() {
    const [type, number] = this.props.courseName.split(" ");
    console.log(type, number);
    fetch(
      `http://django-env.bvi52yefg9.us-west-2.elasticbeanstalk.com/api/classes/${type}/${number}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.length !== 0)
          this.setState({ course: data, loading: false }, () =>
            console.log(this.state.course)
          );
      })
      .catch(console.log);
  }

  componentDidUpdate() {
    if (this.state.loading) this.fetchCourse();
  }

  componentDidMount() {
    this.fetchCourse();
  }

  renderClass() {
    const courseInfo = this.state.course[0];
    if (courseInfo === null) return null;
    let classElements = [];
    // Render class info
    const title = `${courseInfo.code} - ${courseInfo.name}`;
    console.log(courseInfo, courseInfo.code);
    const department = courseInfo.code.split(" ")[0];
    const enforcedPrereq = courseInfo.en_prereq;
    const { credit, term, description } = courseInfo;

    classElements.push(
      <ClassInfoContainer key="classInfo">
        <ClassTitle>{title}</ClassTitle>
        <ClassInfo>
          <ClassInfoLeft>
            <ClassInfoItem>
              <ClassInfoItemBold>Department: </ClassInfoItemBold>
              <ClassInfoItemRegular>{department}</ClassInfoItemRegular>
            </ClassInfoItem>
            <ClassInfoItem>
              <ClassInfoItemBold>Credit: </ClassInfoItemBold>
              <ClassInfoItemRegular>{credit}</ClassInfoItemRegular>
            </ClassInfoItem>
            <ClassInfoItem>
              <ClassInfoItemBold>Term: </ClassInfoItemBold>
              <ClassInfoItemRegular>{term}</ClassInfoItemRegular>
            </ClassInfoItem>
            <ClassInfoItem>
              <ClassInfoItemBold>Enforced Prerequisites: </ClassInfoItemBold>
              <ClassInfoItemRegular>{enforcedPrereq}</ClassInfoItemRegular>
            </ClassInfoItem>
          </ClassInfoLeft>
          <ClassInfoRight>
            <ClassInfoItem>
              <ClassInfoItemBold>Description: </ClassInfoItemBold>
              <ClassInfoItemRegular>{description}</ClassInfoItemRegular>
            </ClassInfoItem>
          </ClassInfoRight>
        </ClassInfo>
      </ClassInfoContainer>
    );

    // Render section info

    return classElements;
  }

  render() {
    return (
      <WelcomePageContainer>
        <LogoContainer src={Logo} alt="website logo" />
        <SearchBarContainer>
          <SearchBar />
        </SearchBarContainer>
        {this.state.loading && (
          <Spinner size={70} style={{ position: "absolute", top: "38%" }} />
        )}
        {!this.state.loading && this.renderClass()}
      </WelcomePageContainer>
    );
  }
}

const mapStateToProps = state => ({
  courseName: state.selectedClass
});

export default connect(
  mapStateToProps,
  null
)(CourseInfoPage);
