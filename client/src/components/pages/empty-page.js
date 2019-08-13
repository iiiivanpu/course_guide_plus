import { styled } from "baseui";
import React from "react";
import Logo from "../../static/logo.png";
import SearchBar from "../serach-bar";
import { selectAClass } from "../../reducers/mainUi";
import { connect } from "react-redux";

const WelcomePageContainer = styled("div", {
  height: "55vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
});
const LogoContainer = styled("img", {
  marginBottom: "30px",
  width: "50%",
  userSelect: "none",
  cursor: "pointer"
});
const SearchBarContainer = styled("div", {
  position: "aboluste",
  width: "80%"
});

class EmptyPage extends React.Component {
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
        </SearchBarContainer>
      </WelcomePageContainer>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  selectAClass: className => {
    dispatch(selectAClass(className));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(EmptyPage);
