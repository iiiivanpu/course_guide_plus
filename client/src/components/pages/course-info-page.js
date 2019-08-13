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
  margin: props.$isMobile ? '5px' : '30px 30px 0 30px',
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
  width: '100%',
});
const ClassInfoContainer = styled('div', {
  marginBottom: '30px',
});
const ClassInfoLeft = styled('div', {
  flexGrow: '1',
  flexBasis: '0',
  display: 'table',
  borderSpacing: '5px 10px',
});
const ClassInfoRight = styled('div', {
  flexGrow: '1',
  flexBasis: '0',
  display: 'table',
  borderSpacing: '5px 10px',
});
const ClassInfoItem = styled('div', {
  display: 'table-row',
});
const ClassInfoItemBold = styled('div', {
  fontWeight: 'bold',
  display: 'table-cell',
});
const ClassInfoItemRegular = styled('div', {
  display: 'table-cell',
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
});

class CourseInfoPage extends React.Component {
  state = {
    courseName: null,
    courseInfo: null,
    loading: true,
  };

  fetchCourse() {
    if (!this.state.loading) this.setState({ loading: true });
    const { courseName } = this.props;
    const [type, number] = this.props.courseName.split(' ');
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
        console.warn('error');
      }
    };
    xhr.timeout = 3000; // timeout in 3 seconds
    xhr.ontimeout = e => {
      this.setState({ courseInfo: null, loading: false }, () =>
        console.log('Failed to fetch the course information')
      );
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
    const allSections = this.state.courseInfo;
    if (allSections.length === 0) {
      classElements.push(
        <ClassInfoContainer key="classInfo-empty">
          <div>
            There is no data for the selected class right now. Please try again
            later!
          </div>
        </ClassInfoContainer>
      );
    } else {
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
          <ClassInfoContainer key="classInfo-mobile">
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
                <ClassInfoItemRegularMobile>{term}</ClassInfoItemRegularMobile>
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
                <ClassInfoItemBoldMobile>Description:</ClassInfoItemBoldMobile>
                <ClassInfoItemRegularMobile>
                  {description}
                </ClassInfoItemRegularMobile>
              </ClassInfoItemMobile>
              <ClassInfoItemMobile>
                <ClassInfoItemBoldMobile>Course Link:</ClassInfoItemBoldMobile>
                <ClassInfoItemRegularMobile>
                  <StyledLink href={classUrl}>{classUrl}</StyledLink>
                </ClassInfoItemRegularMobile>
              </ClassInfoItemMobile>
            </InfoContainerMobile>
          </ClassInfoContainer>
        );
        // Render section info
        allSections.forEach((currentSection, index) => {
          console.log(currentSection, index);
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
          console.log(section);
          classElements.push(
            <SectionInfoCointainer>
              <SectionTitle>{`Section - ${section}`}</SectionTitle>
              <InfoContainerMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>Section Id:</ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {sectionId}
                  </ClassInfoItemRegularMobile>
                </ClassInfoItemMobile>
                <ClassInfoItemMobile>
                  <ClassInfoItemBoldMobile>
                    Instructor Name:
                  </ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {instructorName}
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
                      <StyledLink href={classUrl}>{classUrl}</StyledLink>
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
                  <ClassInfoItemBoldMobile>Status:</ClassInfoItemBoldMobile>
                  <ClassInfoItemRegularMobile>
                    {status}
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
            </SectionInfoCointainer>
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
                  <ClassInfoItemBold>Enforced Prerequisites:</ClassInfoItemBold>
                  <ClassInfoItemRegular>{enforcedPrereq}</ClassInfoItemRegular>
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
          console.log(currentSection, index);
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
          console.log(section);
          classElements.push(
            <SectionInfoCointainer>
              <SectionTitle>{`Section - ${section}`}</SectionTitle>
              <InfoContainer>
                <ClassInfoLeft>
                  <ClassInfoItem>
                    <ClassInfoItemBold>Section Id:</ClassInfoItemBold>
                    <ClassInfoItemRegular>{sectionId}</ClassInfoItemRegular>
                  </ClassInfoItem>
                  <ClassInfoItem>
                    <ClassInfoItemBold>Status:</ClassInfoItemBold>
                    <ClassInfoItemRegular>{status}</ClassInfoItemRegular>
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
                    <ClassInfoItemBold>Instructor Name:</ClassInfoItemBold>
                    <ClassInfoItemRegular>
                      {instructorName}
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
                    <ClassInfoItemBold>RateMyProfessor Link:</ClassInfoItemBold>
                    <ClassInfoItemRegular>
                      {instructorUrl ? (
                        <StyledLink href={classUrl}>{classUrl}</StyledLink>
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

    return classElements;
  }

  render() {
    return (
      <WelcomePageContainer $isMobile={this.props.isMobile}>
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
