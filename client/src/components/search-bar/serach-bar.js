import React from "react";
import { withStyle } from "baseui";
import { StatefulSelect, StyledDropdownListItem, TYPE } from "baseui/select";
import { StyledList } from "baseui/menu";
import List from "react-virtualized/dist/commonjs/List";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
const ListItem = withStyle(StyledDropdownListItem, {
  paddingTop: 0,
  paddingBottom: 0,
  display: "flex",
  alignItems: "center"
});
const Container = withStyle(StyledList, { height: "500px" });
const VirtualList = React.forwardRef((props, ref) => {
  const children = React.Children.toArray(props.children);
  return (
    <Container ref={ref}>
      <AutoSizer>
        {({ width }) => (
          <List
            role={props.role}
            height={500}
            width={width}
            rowCount={props.children.length}
            rowHeight={36}
            rowRenderer={({ index, key, style }) => {
              return (
                <ListItem key={key} style={style} {...children[index].props}>
                  {children[index].props.item.id}
                </ListItem>
              );
            }}
          />
        )}
      </AutoSizer>
    </Container>
  );
});
const json = require("../../constants/all_course_name_list.json");
const newAllCourseNames = json.name_list.sort().reduce((memo, name) => {
  memo.push({ id: name });
  return memo;
}, []);
console.log(newAllCourseNames);
export default () => (
  <StatefulSelect
    options={newAllCourseNames}
    labelKey="id"
    overrides={{ Dropdown: { component: VirtualList } }}
    onChange={event => console.log(event)}
    placeholder="Choose a class..."
    type={TYPE.search}
    maxDropdownHeight="300px"
  />
);
