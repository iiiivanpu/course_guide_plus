import { styled } from 'baseui';
import React from 'react';
import Logo from '../../static/logo.png';
import SearchBar from '../serach-bar';
import { Spinner } from 'baseui/spinner';
import { selectAClass } from '../../reducers/mainUi';
import { connect } from 'react-redux';

const WelcomePageContainer = styled('div', props => ({
  height: '20vh',
  display: 'flex',
  flexDirection: 'column',
  margin: props.$isMobile ? '5px' : '30px',
}));
const StyledLink = styled('a', props => ({
  color: '#2c3e6d',
}));
const LogoContainer = styled('img', {
  marginBottom: '30px',
  width: '30%',
  userSelect: 'none',
  cursor: 'pointer',
});
const SearchBarContainer = styled('div', {
  width: '60%',
  marginBottom: '30px',
});
const InfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  border: '1px solid grey',
  borderRadius: '10px',
  padding: '10px',
});
const InfoContainerMobile = styled('div', {
  display: 'table',
  justifyContent: 'space-around',
  border: '1px solid grey',
  borderRadius: '10px',
  borderSpacing: '3px',
  tableLayout: 'fixed',
  width: '100%',
});
const ClassInfoContainer = styled('div', {
  marginBottom: '30px',
  // A trial-and-error value that fixes the section info to prevent collapsing
  minWidth: '900px',
});
const ClassInfoContainerMobile = styled('div', {
  marginBottom: '30px',
});
const ClassInfoLeft = styled('div', {
  flexGrow: '1',
  flexBasis: '0',
  // display: 'table',
  // borderSpacing: '5px 10px',
});
const ClassInfoRight = styled('div', {
  flexGrow: '1',
  flexBasis: '0',
  display: 'table',
  borderSpacing: '10px 10px',
  tableLayout: 'fixed',
});
const ClassInfoItem = styled('div', {
  // display: 'table-row',
  display: 'flex',
});
const ClassInfoItemBold = styled('div', {
  fontWeight: 'bold',
  // display: 'table-cell',
  // flexGrow: '1',
  // flexBasis: '0',
  // width: '2%',
  // margin: '5px',
  float: 'left',
});
const ClassInfoItemRegular = styled('div', {
  // flexGrow: '2',
  // flexBasis: '0',
});
const ClassInfoItemMobile = styled('div', {
  display: 'flow',
  flowDirection: 'column',
  margin: '10px',
});
const ClassInfoItemBoldMobile = styled('div', {
  fontWeight: '700',
});
const ClassInfoItemRegularMobile = styled('div', {
  marginTop: '2px',
  // Wrap long links
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
});
const ClassTitle = styled('div', {
  color: 'white',
  backgroundColor: '#2c3e6d',
  border: '1px solid grey',
  borderRadius: '10px',
  padding: '10px',
  display: 'table',
  width: 'auto',
  fontWeight: 'bold',
  // Use max and min width to automatically adjust the width
  maxWidth: '100%',
  minWidth: '0',
});
const SpinnerContainer = styled('div', {
  marginTop: '50px',
  marginLeft: '50px',
});
const SectionTitle = styled('div', {
  backgroundColor: '#FFCB05',
  border: '1px solid grey',
  borderRadius: '10px',
  padding: '10px',
  display: 'table',
  width: 'auto',
  fontWeight: 'bold',
  // Use max and min width to automatically adjust the width
  maxWidth: '100%',
  minWidth: '0',
});
const SectionInfoCointainer = styled('div', {
  marginBottom: '30px',
  width: '70%',
  // A trial-and-error value that fixes the section info to prevent collapsing
  minWidth: '900px',
});
const SectionInfoCointainerMobile = styled('div', {
  marginBottom: '30px',
});
const ClosedSection = styled('div', {
  color: 'red',
  textTransform: 'uppercase',
});
const OpenSection = styled('div', {
  color: 'green',
  textTransform: 'uppercase',
});

class CourseInfoPage extends React.Component {
  state = {
    courseName: null,
    courseInfo: null,
    loading: true,
    courseExists: false,
  };

  renderStatus(status) {
    return status === 'Closed' ? (
      <ClosedSection>{status}</ClosedSection>
    ) : (
      <OpenSection>{status}</OpenSection>
    );
  }

  fetchCourse() {
    if (!this.state.loading) this.setState({ loading: true });
    const { courseName } = this.props;
    const json = require('../../constants/all_course_name_list.json');
    const courseExists = json.name_list.includes(courseName);
    if (!courseExists) {
      this.setState({
        courseExists: courseExists,
        loading: false,
        courseInfo: null,
      });
      return;
    }

    const [type, number] = courseName.split(' ');
    const requestUrl = `https://api.course-guide-plus.ml/classes/${type}/${number}`;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = e => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res)
            this.setState({
              courseName: courseName,
              courseInfo: res,
              loading: false,
              courseExists: courseExists,
            });
        } catch (e) {
          console.warn(e);
        }
      } else {
        console.warn('error');
      }
    };
    xhr.timeout = 3000; // timeout in 3 seconds
    xhr.ontimeout = e => {
      this.setState({
        courseInfo: null,
        loading: false,
        courseExists: courseExists,
      });
    };
    xhr.open('GET', requestUrl);
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
    let classElements = [];
    if (!this.state.courseExists)
      classElements.push(
        <ClassInfoContainer key="classInfo-nonExisting">
          The course requested does not exist in our database, please check
          again!
        </ClassInfoContainer>
      );
    else {
      const allSections = this.state.courseInfo;
      if (allSections === null || allSections.length === 0) {
        classElements.push(
          <ClassInfoContainer key="classInfo-empty">
            There is no data for the selected class right now. Please try again
            later!
          </ClassInfoContainer>
        );
      } else {
        // Sort the array of sections by section id
        allSections.sort((a, b) => (a.section > b.section ? 1 : -1));
        const currentClass = allSections[0];
        const title = `${currentClass.code} - ${currentClass.name}`;
        const department = currentClass.code.split(' ')[0];
        const enforcedPrereq = currentClass.en_prereq;
        const classUrl = currentClass.lsa_url;
        const { credit, term, description } = currentClass;

        if (this.props.isMobile) {
          // Currently on a mobile device
          // Render class info
          classElements.push(
            <ClassInfoContainerMobile key="classInfo-mobile">
              <ClassTitle>{title}</ClassTitle>
              <InfoContainerMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>Department:</ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {department}
                  </ClassInfoItemRegularMobile>
                </ClassInfoItemMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>Credit:</ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {credit}
                  </ClassInfoItemRegularMobile>
                </ClassInfoItemMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>Term:</ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {term}
                  </ClassInfoItemRegularMobile>
                </ClassInfoItemMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>
                    Enforced Prerequisites:
                  </ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {enforcedPrereq}
                  </ClassInfoItemRegularMobile>
                </ClassInfoItemMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>
                    Description:
                  </ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {description}
                  </ClassInfoItemRegularMobile>
                </ClassInfoItemMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>
                    Course Link:
                  </ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    <StyledLink href={classUrl}>{classUrl}</StyledLink>
                  </ClassInfoItemRegularMobile>
                </ClassInfoItemMobile>
              </InfoContainerMobile>
            </ClassInfoContainerMobile>
          );
          // Render section info
          allSections.forEach((currentSection, index) => {
            const sectionId = currentSection.id;
            const instructorName = currentSection.instructor_name;
            const instructorScore = currentSection.instructor_score;
            const instructorUrl = currentSection.instructor_url;
            const {
              location,
              seats,
              section,
              status,
              term,
              time,
              waitlist,
            } = currentSection;
            classElements.push(
              <SectionInfoCointainerMobile key={sectionId}>
                <SectionTitle>{`Section ${section} - ${sectionId}`}</SectionTitle>
                <InfoContainerMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>
                      Instructor:
                    </ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      <StyledLink href={instructorUrl}>
                        {instructorName}
                      </StyledLink>
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>
                      RateMyProfessor Score:
                    </ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {instructorScore || 'N/A'}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>
                      RateMyProfessor Link:
                    </ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {instructorUrl ? (
                        <StyledLink href={instructorUrl}>
                          {instructorUrl}
                        </StyledLink>
                      ) : (
                        'N/A'
                      )}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>Term:</ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {term}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>
                      Enroll Status:
                    </ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {this.renderStatus(status)}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>Seats:</ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {seats}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>Location:</ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {location}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>Time:</ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {time}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>Waitlist:</ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      {waitlist}
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                </InfoContainerMobile>
              </SectionInfoCointainerMobile>
            );
          });
        } else {
          // Currently on a pc
          // Render class info
          classElements.push(
            <ClassInfoContainer key="classInfo-pc">
              <ClassTitle>{title}</ClassTitle>
              <InfoContainer>
                <ClassInfoLeft>
                  <ClassInfoItem>
                    <ClassInfoItemRegular>
                      <ClassInfoItemBold>Department: </ClassInfoItemBold>
                      {department}
                    </ClassInfoItemRegular>
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
                    <ClassInfoItemRegular>
                      <ClassInfoItemBold>
                        Enforced Prerequisites:
                      </ClassInfoItemBold>
                      {enforcedPrereq}
                    </ClassInfoItemRegular>
                  </ClassInfoItem>
                </ClassInfoLeft>
                <ClassInfoRight>
                  <ClassInfoItem>
                    <ClassInfoItemBold>Description: </ClassInfoItemBold>
                    <ClassInfoItemRegular>{description}</ClassInfoItemRegular>
                  </ClassInfoItem>
                  <ClassInfoItem>
                    <ClassInfoItemBold>Course Link: </ClassInfoItemBold>
                    <ClassInfoItemRegular>
                      <StyledLink href={classUrl}>{classUrl}</StyledLink>
                    </ClassInfoItemRegular>
                  </ClassInfoItem>
                </ClassInfoRight>
              </InfoContainer>
            </ClassInfoContainer>
          );
          // Render section info
          allSections.forEach((currentSection, index) => {
            const sectionId = currentSection.id;
            const instructorName = currentSection.instructor_name;
            const instructorScore = currentSection.instructor_score;
            const instructorUrl = currentSection.instructor_url;
            const {
              location,
              seats,
              section,
              status,
              term,
              time,
              waitlist,
            } = currentSection;
            classElements.push(
              <SectionInfoCointainer key={sectionId}>
                <SectionTitle>{`Section ${section} - ${sectionId}`}</SectionTitle>
                <InfoContainer>
                  <ClassInfoLeft>
                    <ClassInfoItem>
                      <ClassInfoItemBold>Enroll Status:</ClassInfoItemBold>
                      <ClassInfoItemRegular>
                        {this.renderStatus(status)}
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemBold>Seats:</ClassInfoItemBold>
                      <ClassInfoItemRegular>{seats}</ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemBold>Waitlist:</ClassInfoItemBold>
                      <ClassInfoItemRegular>{waitlist}</ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemBold>Location:</ClassInfoItemBold>
                      <ClassInfoItemRegular>{location}</ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemBold>Time:</ClassInfoItemBold>
                      <ClassInfoItemRegular>{time}</ClassInfoItemRegular>
                    </ClassInfoItem>
                  </ClassInfoLeft>
                  <ClassInfoRight>
                    <ClassInfoItem>
                      <ClassInfoItemBold>Term:</ClassInfoItemBold>
                      <ClassInfoItemRegular>{term}</ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemBold>Instructor:</ClassInfoItemBold>
                      <ClassInfoItemRegular>
                        <StyledLink href={instructorUrl}>
                          {instructorName}
                        </StyledLink>
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemBold>
                        RateMyProfessor Score:
                      </ClassInfoItemBold>
                      <ClassInfoItemRegular>
                        {instructorScore || 'N/A'}
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemBold>
                        RateMyProfessor Link:
                      </ClassInfoItemBold>
                      <ClassInfoItemRegular>
                        {instructorUrl ? (
                          <StyledLink href={instructorUrl}>
                            {instructorUrl}
                          </StyledLink>
                        ) : (
                          'N/A'
                        )}
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                  </ClassInfoRight>
                </InfoContainer>
              </SectionInfoCointainer>
            );
          });
        }
      }
    }

    return classElements;
  }

  render() {
    return (
      <WelcomePageContainer $isMobile={this.props.isMobile}>
        <LogoContainer
          src={Logo}
          alt="website logo"
          onClick={() => this.props.selectAClass(null)}
          draggable="false"
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
)(CourseInfoPage);
