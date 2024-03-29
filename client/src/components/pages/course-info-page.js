import { styled } from 'baseui';
import React from 'react';
import Logo from '../../static/logo.png';
import SearchBar from '../search-bar';
import { Spinner } from 'baseui/spinner';
import { selectAClass } from '../../reducers/mainUi';
import { connect } from 'react-redux';
import RMPLogo from '../../static/RMP.jpg';

const CourseInfoPageContainer = styled('div', props => ({
  display: 'flex',
  flexDirection: 'column',
  margin: props.$isMobile ? '10px' : '0 15px 15px 15px',
  borderRadius: '20px',
  height: '100%',
  padding: props.$isMobile ? '10px' : '30px',
  top: '5px',
  position: 'relative',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
}));
const StyledLink = styled('a', props => ({
  color: props.$hasLink ? '#2c3e6d' : 'black',
}));
const LogoSearchBarContainer = styled('div', {
  top: '-58px',
  left: '5px',
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'none',
  // Fix the search bar to prevent change to width
  maxWidth: '638px',
});
const LogoContainer = styled('img', {
  width: '30%',
  userSelect: 'none',
  cursor: 'pointer',
});
const SearchBarContainer = styled('div', {
  margin: '10px 0 0 10px',
  width: '60%',
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
});
const ClassInfoRight = styled('div', {
  flexGrow: '1',
  flexBasis: '0',
  position: 'relative',
});
const ClassInfoItem = styled('div', {
  display: 'table',
  // display: 'flex',
});
const ClassInfoItemBold = styled('div', {
  fontWeight: 'bold',
  float: 'left',
  marginRight: '5px',
});
const ClassInfoItemRegular = styled('div', {
  margin: '5px 5px',
});
const ClassInfoItemMobile = styled('div', {
  display: 'flow',
  margin: '10px',
});
const ClassInfoItemBoldMobile = styled('div', {
  fontWeight: 'bold',
  float: 'left',
  marginRight: '5px',
});
const ClassInfoItemRegularMobile = styled('div', {
  // Wrap long links
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
});
const ClassTitle = styled('div', props => ({
  color: 'white',
  backgroundColor: '#2c3e6d',
  borderRadius: '10px',
  padding: props.$isMobile ? '3px 10px 3px 10px' : '10px',
  display: 'table',
  width: 'auto',
  fontWeight: 'bold',
  // Use max and min width to automatically adjust the width
  maxWidth: '100%',
  minWidth: '0',
}));
const SpinnerContainer = styled('div', {
  marginTop: '50px',
  marginLeft: '50px',
});
const SectionTitle = styled('div', props => ({
  backgroundColor: '#FFCB05',
  borderRadius: '10px',
  padding: props.$isMobile ? '3px 10px 3px 10px' : '10px',
  display: 'table',
  width: 'auto',
  fontWeight: 'bold',
  // Use max and min width to automatically adjust the width
  maxWidth: '100%',
  minWidth: '0',
}));
const SectionInfoCointainer = styled('div', {
  marginBottom: '30px',
  width: '70%',
  // A trial-and-error value that fixes the section info to prevent collapsing
  minWidth: '900px',
});
const SectionInfoCointainerMobile = styled('div', {
  marginBottom: '30px',
});
const StatusContainer = styled('span', props => ({
  color: props.$closed ? 'red' : 'green',
}));
const RMPContainer = styled('div', {
  display: 'flex',
  position: 'absolute',
  top: '-30px',
  right: '0',
  overflow: 'hidden',
});
const RMPLogoContainer = styled('img', props => ({
  width: '175px',
  height: '100px',
  cursor: props.$clickable ? 'pointer' : 'not-allowed',
  // A hacky way to make the white backround of the img transparent
  mixBlendMode: 'multiply',
}));
const RMPScore = styled('a', {
  position: 'relative',
  fontWeight: 'bold',
  fontSize: '30px',
  color: '#28A9E0',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  top: '-5px',
});
const DayTimeContainer = styled('div', {
  position: 'absolute',
  bottom: '0',
  right: '0',
});

class CourseInfoPage extends React.Component {
  state = {
    courseName: null,
    courseInfo: null,
    loading: true,
    courseExists: false,
  };

  fetchCourse() {
    if (!this.state.loading) this.setState({ loading: true });
    const { courseName } = this.props;
    const json = require('../../constants/all_course_name_list.json');
    const courseExists = Object.keys(json).includes(courseName);
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
    window.onpopstate = this.handlePopState;
  }

  componentWillUnmount() {
    window.onpopstate = null;
  }

  handlePopState = event => {
    event.preventDefault();
    setTimeout(() => this.props.selectAClass(null), 250);
  };

  // A helper function that renders each class info item
  // key: string is the left title, value: string is the right description
  renderClassInfoItem(key, value) {
    let newValue = value;
    if (
      value === null ||
      typeof value === 'undefined' ||
      // Exception for empty Location
      value === '' ||
      // Exception for empty Day/Time
      value === ' '
    )
      newValue = 'N/A';
    return (
      <ClassInfoItem>
        <ClassInfoItemRegular>
          <ClassInfoItemBold>{`${key}:`}</ClassInfoItemBold>
          {key === 'Enforced Prerequisites'
            ? this.renderEnforcedPrereq(newValue)
            : newValue}
        </ClassInfoItemRegular>
      </ClassInfoItem>
    );
  }

  renderClassInfoItemMobile(key, value) {
    let newValue = value;
    if (
      value === null ||
      typeof value === 'undefined' ||
      // Exception for empty Location
      value === '' ||
      // Exception for empty Day/Time
      value === ' '
    )
      newValue = 'N/A';
    return (
      <ClassInfoItemMobile>
        <ClassInfoItemRegularMobile>
          <ClassInfoItemBoldMobile>{`${key}:`}</ClassInfoItemBoldMobile>
          {key === 'Enforced Prerequisites'
            ? this.renderEnforcedPrereq(newValue)
            : newValue}
        </ClassInfoItemRegularMobile>
      </ClassInfoItemMobile>
    );
  }

  gradeRequirementHelper(value, output, count) {
    // Process grade requirement
    let front = 0;
    let match;
    const gradeRegExp = RegExp(
      /at least [A|B|C][+|-]?|[A|B|C][+|-]? or better|graduate standing|minimum gpa of \d.\d/,
      'gi'
    );
    while ((match = gradeRegExp.exec(value)) !== null) {
      const matchLength = match[0].length;
      const pos = match.index;
      const matchPhrase = value.substring(pos, pos + matchLength);
      output.push(
        <span key={`grade-${pos}-${matchLength}`}>
          {value.substring(front, pos)}
        </span>
      );
      output.push(
        <span key={matchPhrase} style={{ color: 'red' }}>
          {matchPhrase}
        </span>
      );
      front = pos + matchLength;
    }
    const followingText = value.substring(front, value.length);
    output.push(<span key={`grade-end-${count}`}>{followingText}</span>);
  }

  renderEnforcedPrereq(value) {
    if (value === 'N/A') return <>{value}</>;

    let output = [];
    let front = 0;
    let match;
    let count = 0;
    let previousCourseType = '';

    // Process course codes
    const courseCodeRegExp = RegExp(
      /[A-Z]{3,} [0-9]{3,}|[A-Z]{3,}[0-9]{3,}|or [0-9]{3,}/,
      'g'
    );
    while ((match = courseCodeRegExp.exec(value)) !== null) {
      count += 1;
      const matchLength = match[0].length;
      const matchPos = match.index;
      const previousText = value.substring(front, matchPos);
      let courseCode = value.substring(matchPos, matchPos + matchLength);
      const [courseType, courseNumber] = courseCode.split(' ');
      let newCourseType = courseType.toUpperCase();
      const courseTypeMissing = newCourseType === 'OR';

      if (courseTypeMissing) {
        newCourseType = previousCourseType;
      } else {
        previousCourseType = courseType;
      }
      const courseLink = `https://course-guide-plus.ml/?type=${newCourseType}&number=${courseNumber}`;

      this.gradeRequirementHelper(previousText, output, count);
      if (courseTypeMissing) {
        output.push(
          <span key={`${newCourseType}-${courseNumber}-or`}>or </span>
        );
        output.push(
          <a
            key={courseCode}
            style={{ color: 'blue' }}
            href={courseLink}
            target="_blank"
            rel="noopener noreferrer"
            title={`Link to course ${newCourseType} ${courseNumber}`}
          >
            {courseNumber}
          </a>
        );
      } else {
        output.push(
          courseCode !== this.props.courseName ? (
            <a
              key={courseCode}
              style={{ color: 'blue' }}
              href={courseLink}
              target="_blank"
              rel="noopener noreferrer"
              title={`Link to course ${courseCode}`}
            >
              {courseCode}
            </a>
          ) : (
            <span key={courseCode}>{courseCode}</span>
          )
        );
      }

      front = matchPos + matchLength;
    }
    const followingText = value.substring(front, value.length);
    this.gradeRequirementHelper(followingText, output);
    return <>{output}</>;
  }

  // Renders message for courses that are not in the all_course_name_list.json file
  renderNonExistingMessage() {
    const message =
      'The course requested does not exist in our database, please check again!';
    return this.props.isMobile ? (
      <ClassInfoContainerMobile key="classInfo-nonExisting">
        {message}
      </ClassInfoContainerMobile>
    ) : (
      <ClassInfoContainer key="classInfo-nonExisting">
        {message}
      </ClassInfoContainer>
    );
  }

  // Render message when the course requested in not in our database
  renderEmptyMessage() {
    const message =
      'There is no data for the selected class right now. Please try again later!';
    return this.props.isMobile ? (
      <ClassInfoContainerMobile key="classInfo-nonExisting">
        {message}
      </ClassInfoContainerMobile>
    ) : (
      <ClassInfoContainer key="classInfo-nonExisting">
        {message}
      </ClassInfoContainer>
    );
  }

  renderClass() {
    let classElements = [];
    if (!this.state.courseExists) {
      classElements.push(this.renderNonExistingMessage());
    } else {
      const allSections = this.state.courseInfo;
      if (allSections === null || allSections.length === 0) {
        classElements.push(this.renderEmptyMessage());
      } else {
        // Sort the array of sections by section id
        allSections.sort((a, b) => (a.section > b.section ? 1 : -1));
        const currentClass = allSections[0];
        const title = `${currentClass.code} - ${currentClass.name}`;
        const department = currentClass.code.split(' ')[0];
        const enforcedPrereq = currentClass.en_prereq;
        const classUrl = currentClass.lsa_url;
        const { credit, term, description } = currentClass;
        const longDescription = description.length > 400;
        if (this.props.isMobile) {
          // Currently on a mobile device
          // Render class info
          classElements.push(
            <ClassInfoContainerMobile key="classInfo-mobile">
              <ClassTitle $isMobile={this.props.isMobile}>{title}</ClassTitle>
              <InfoContainerMobile>
                {this.renderClassInfoItemMobile('Department', department)}
                {this.renderClassInfoItemMobile('Credit', credit)}
                {this.renderClassInfoItemMobile('Term', term)}
                {this.renderClassInfoItemMobile(
                  'Enforced Prerequisites',
                  enforcedPrereq
                )}
                {this.renderClassInfoItemMobile('Description', description)}
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>
                    Course Link:
                  </ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    <StyledLink
                      href={classUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Link to LSA Course Guide for course ${title}`}
                    >
                      {classUrl}
                    </StyledLink>
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
              time,
              waitlist,
            } = currentSection;
            classElements.push(
              <SectionInfoCointainerMobile key={sectionId}>
                <SectionTitle
                  $isMobile={this.props.isMobile}
                >{`Section ${section} - ${sectionId}`}</SectionTitle>
                <InfoContainerMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemBoldMobile>
                      Instructor:
                    </ClassInfoItemBoldMobile>
                    <ClassInfoItemRegularMobile>
                      <StyledLink
                        href={instructorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          instructorScore
                            ? `Link to RateMyProfessors.com for instructor ${instructorName}`
                            : `Instructor ${instructorName} has no data at RateMyProfessor.com currently`
                        }
                        $hasLink={instructorUrl}
                      >
                        {instructorName || 'N/A'}
                      </StyledLink>
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemRegularMobile>
                      <ClassInfoItemBoldMobile>
                        RateMyProfessor Score:
                      </ClassInfoItemBoldMobile>
                      <span
                        style={{
                          color: instructorScore ? '#28A9E0' : 'black',
                          fontWeight: instructorScore ? 'bold' : 'default',
                        }}
                      >
                        {instructorScore || 'N/A'}
                      </span>
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  <ClassInfoItemMobile>
                    <ClassInfoItemRegularMobile>
                      <ClassInfoItemBoldMobile>
                        Enroll Status:
                      </ClassInfoItemBoldMobile>
                      <StatusContainer $closed={status === 'Closed'}>
                        {status}
                      </StatusContainer>
                    </ClassInfoItemRegularMobile>
                  </ClassInfoItemMobile>
                  {this.renderClassInfoItemMobile('Open Seats', seats)}
                  {this.renderClassInfoItemMobile('Waitlist', waitlist)}
                  {this.renderClassInfoItemMobile('Location', location)}
                  {this.renderClassInfoItemMobile('Day/Time', time)}
                </InfoContainerMobile>
              </SectionInfoCointainerMobile>
            );
          });
        } else {
          // Currently on a pc
          // Render class info
          classElements.push(
            <ClassInfoContainer key="classInfo-pc">
              <ClassTitle $isMobile={this.props.isMobile}>{title}</ClassTitle>
              <InfoContainer>
                <ClassInfoLeft>
                  {this.renderClassInfoItem('Department', department)}
                  {this.renderClassInfoItem('Credit', credit)}
                  {this.renderClassInfoItem('Term', term)}
                  {this.renderClassInfoItem(
                    'Enforced Prerequisites',
                    enforcedPrereq
                  )}
                  {longDescription && (
                    <ClassInfoItem>
                      <ClassInfoItemRegular>
                        <ClassInfoItemBold>Course Link:</ClassInfoItemBold>
                        <StyledLink
                          href={classUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Link to LSA Course Guide for course ${title}`}
                        >
                          {classUrl}
                        </StyledLink>
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                  )}
                </ClassInfoLeft>
                <ClassInfoRight>
                  {this.renderClassInfoItem('Description', description)}
                  {!longDescription && (
                    <ClassInfoItem>
                      <ClassInfoItemRegular>
                        <ClassInfoItemBold>Course Link:</ClassInfoItemBold>
                        <StyledLink
                          href={classUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Link to LSA Course Guide for course ${title}`}
                        >
                          {classUrl}
                        </StyledLink>
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                  )}
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
              time,
              waitlist,
            } = currentSection;
            classElements.push(
              <SectionInfoCointainer key={sectionId}>
                <SectionTitle
                  $isMobile={this.props.isMobile}
                >{`Section ${section} - ${sectionId}`}</SectionTitle>
                <InfoContainer>
                  <ClassInfoLeft>
                    <ClassInfoItem>
                      <ClassInfoItemRegular>
                        <ClassInfoItemBold>Instructor:</ClassInfoItemBold>
                        <StyledLink
                          href={instructorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={
                            instructorUrl
                              ? `Link to RateMyProfessor.com for instructor ${instructorName}`
                              : `Instructor ${instructorName} has no data at RateMyProfessor.com currently`
                          }
                        >
                          {instructorName || 'N/A'}
                        </StyledLink>
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                    <ClassInfoItem>
                      <ClassInfoItemRegular>
                        <ClassInfoItemBold>Enroll Status:</ClassInfoItemBold>
                        <StatusContainer $closed={status === 'Closed'}>
                          {status}
                        </StatusContainer>
                      </ClassInfoItemRegular>
                    </ClassInfoItem>
                    {this.renderClassInfoItem('Seats', seats)}
                    {this.renderClassInfoItem('Waitlist', waitlist)}
                    {this.renderClassInfoItem('Location', location)}
                  </ClassInfoLeft>
                  <ClassInfoRight>
                    <RMPContainer>
                      <a
                        href={instructorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <RMPLogoContainer
                          src={RMPLogo}
                          alt="Rate my professor logo"
                          $clickable={instructorUrl}
                          title={
                            instructorScore
                              ? `Link to RateMyProfessors.com for instructor ${instructorName}`
                              : `Instructor ${instructorName} has no data at RateMyProfessor.com currently`
                          }
                        />
                      </a>
                      <RMPScore
                        href={instructorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          instructorScore
                            ? `Link to RateMyProfessors.com for instructor ${instructorName}`
                            : `Instructor ${instructorName} has no data at RateMyProfessor.com currently`
                        }
                      >
                        {instructorScore || 'N/A'}
                      </RMPScore>
                    </RMPContainer>
                    <DayTimeContainer>
                      {this.renderClassInfoItem('Day/Time', time)}
                    </DayTimeContainer>
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
      <CourseInfoPageContainer $isMobile={this.props.isMobile}>
        <LogoSearchBarContainer>
          <LogoContainer
            src={Logo}
            alt="website logo"
            // Add timeout to make it less abrupt
            onClick={() => setTimeout(() => this.props.selectAClass(null), 250)}
            draggable="false"
          />
          <SearchBarContainer>
            <SearchBar />
          </SearchBarContainer>
        </LogoSearchBarContainer>
        {this.state.loading ? (
          <SpinnerContainer>
            <Spinner size={70} />
          </SpinnerContainer>
        ) : (
          this.renderClass()
        )}
      </CourseInfoPageContainer>
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
