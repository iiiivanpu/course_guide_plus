import React from "react";
import { styled } from "baseui";
import Logo from "../static/logo.png";
import SearchBar from "./serach-bar";

const WelcomePageContainer = styled("div", {
  height: "55vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
});
const LogoContainer = styled("img", {
  marginBottom: "30px",
  width: "50%"
});
const SearchBarContainer = styled("div", {
  position: "aboluste",
  width: "80%"
});

export default class WelcomePage extends React.Component {
  render() {
    return (
      <WelcomePageContainer>
        <LogoContainer src={Logo} alt="website logo" />
        <SearchBarContainer>
          <SearchBar />
        </SearchBarContainer>
      </WelcomePageContainer>
    );
  }
}
