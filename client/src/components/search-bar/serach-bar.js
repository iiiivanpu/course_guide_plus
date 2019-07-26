import React, { Component } from "react";
import { styled } from "baseui";
import { StatefulSelect } from "baseui/select";

const SearchBarContainer = styled("div", props => ({
  color: "#a5a5ae",
  paddingTop: "8px",
  paddingBottom: "8px",
  width: "50%"
}));

export default class SearchBar extends Component {
  state = {
    allCourseNames: []
  };

  componentDidMount() {
    const json = require("../../constants/all_course_name_list.json");
    const newAllCourseNames = json.name_list.reduce((memo, name) => {
      memo.push({ id: name });
      return memo;
    }, []);
    this.setState({ allCourseNames: newAllCourseNames });
    console.log(newAllCourseNames);
  }

  render() {
    return (
      <SearchBarContainer>
        <StatefulSelect
          options={this.state.allCourseNames}
          labelKey="id"
          onChange={event => console.log(event)}
        />
      </SearchBarContainer>
    );
  }
}
