import { styled } from "baseui";
import React from "react";
import Logo from "../../static/logo.png";
import SearchBar from "../serach-bar";
import { Spinner } from "baseui/spinner";
import { selectAClass } from "../../reducers/mainUi";
import { connect } from "react-redux";

const WelcomePageContainer = styled("div", {
  height: "20vh",
  display: "flex",
  flexDirection: "column",
  margin: "30px 30px 0 30px"
});
const LogoContainer = styled("img", {
  marginBottom: "30px",
  width: "30%",
  userSelect: "none",
  cursor: "pointer"
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
const ClassInfoMobile = styled("div", {
  display: "table",
  justifyContent: "space-around",
  border: "1px solid grey",
  borderRadius: "10px",
  padding: "5px",
  borderSpacing: "10px"
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
  marginBottom: "30px"
});
const ClassInfoItem = styled("div", {
  display: "table",
  borderSpacing: "5px"
});
const ClassInfoItemMobile = styled("div", {
  display: "table-row"
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
const SpinnerContainer = styled("div", {
  marginTop: "50px"
});

class CourseInfoPage extends React.Component {
  state = {
    courseName: null,
    courseInfo: null,
    loading: true
  };

  fetchCourse() {
    if (!this.state.loading) this.setState({ loading: true });
    const { courseName } = this.props;
    const [type, number] = this.props.courseName.split(" ");
    const requestUrl = `http://django-env.bvi52yefg9.us-west-2.elasticbeanstalk.com/api/classes/${type}/${number}`;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = e => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res)
            this.setState(
              { courseName: courseName, courseInfo: res, loading: false },
              () => console.log(this.state.courseInfo)
            );
        } catch (e) {
          console.warn(e);
        }
      } else {
        console.warn("error");
      }
    };
    xhr.timeout = 3000; // timeout in 3 seconds
    xhr.ontimeout = e => {
      this.setState({ courseInfo: null, loading: false }, () =>
        console.log("Failed to fetch the course information")
      );
    };
    xhr.open("GET", requestUrl);
    xhr.send();
  }

  componentDidUpdate(prevProps) {
    if (this.state.loading || prevProps.courseName !== this.props.courseName)
      this.fetchCourse();
  }

  componentDidMount() {
    this.fetchCourse();
  }

  renderClass() {
    const courseInfo = this.state.courseInfo[0];
    if (courseInfo === null || typeof courseInfo === "undefined") return null;
    let classElements = [];
    // Render class info
    console.log(courseInfo);
    const title = `${courseInfo.code} - ${courseInfo.name}`;
    console.log(courseInfo, courseInfo.code);
    const department = courseInfo.code.split(" ")[0];
    const enforcedPrereq = courseInfo.en_prereq;
    const { credit, term, description } = courseInfo;

    if (this.props.isMobile) {
      // Currently on a mobile device
      classElements.push(
        <ClassInfoContainer key="classInfo-mobile">
          <ClassTitle>{title}</ClassTitle>
          <ClassInfoMobile>
            <ClassInfoItemMobile>
              <ClassInfoItemBold>Department:</ClassInfoItemBold>
              <ClassInfoItemRegular>{department}</ClassInfoItemRegular>
            </ClassInfoItemMobile>
            <ClassInfoItemMobile>
              <ClassInfoItemBold>Credit:</ClassInfoItemBold>
              <ClassInfoItemRegular>{credit}</ClassInfoItemRegular>
            </ClassInfoItemMobile>
            <ClassInfoItemMobile>
              <ClassInfoItemBold>Term:</ClassInfoItemBold>
              <ClassInfoItemRegular>{term}</ClassInfoItemRegular>
            </ClassInfoItemMobile>
            <ClassInfoItemMobile>
              <ClassInfoItemBold>Enforced Prerequisites:</ClassInfoItemBold>
              <ClassInfoItemRegular>{enforcedPrereq}</ClassInfoItemRegular>
            </ClassInfoItemMobile>
            <ClassInfoItemMobile>
              <ClassInfoItemBold>Description:</ClassInfoItemBold>
              <ClassInfoItemRegular>{description}</ClassInfoItemRegular>
            </ClassInfoItemMobile>
          </ClassInfoMobile>
        </ClassInfoContainer>
      );
    } else {
      // Currently on a pc
      classElements.push(
        <ClassInfoContainer key="classInfo-pc">
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
    }

    // Render section info

    return classElements;
  }

  render() {
    return (
      <WelcomePageContainer>
        <LogoContainer
          src={Logo}
          alt="website logo"
          onClick={() => this.props.selectAClass(null)}
        />
        <SearchBarContainer>
          <SearchBar />
          {this.state.loading && (
            <SpinnerContainer>
              <Spinner size={70} />
            </SpinnerContainer>
          )}
        </SearchBarContainer>
        {!this.state.loading && this.renderClass()}
      </WelcomePageContainer>
    );
  }
}

const mapStateToProps = state => ({
  courseName: state.selectedClass,
  isMobile: state.isMobile
});

const mapDispatchToProps = dispatch => ({
  selectAClass: className => {
    dispatch(selectAClass(className));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseInfoPage);
