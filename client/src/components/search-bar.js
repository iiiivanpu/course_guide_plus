import React from 'react';
import { withStyle } from 'baseui';
import { StatefulSelect, StyledDropdownListItem, TYPE } from 'baseui/select';
import { StyledList } from 'baseui/menu';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { connect } from 'react-redux';
import { selectAClass } from '../reducers/mainUi';

const ListItem = withStyle(StyledDropdownListItem, {
  paddingTop: 0,
  paddingBottom: 0,
  display: 'flex',
  alignItems: 'center',
});
const Container = withStyle(StyledList, { height: '250px' });
const VirtualList = React.forwardRef((props, ref) => {
  const children = React.Children.toArray(props.children);
  return (
    <Container ref={ref}>
      <AutoSizer>
        {({ width }) => (
          <List
            role={props.role}
            height={250}
            width={width}
            rowCount={props.children.length || 0}
            rowHeight={36}
            rowRenderer={({ index, key, style }) => {
              const { resetMenu, getItemLabel, ...childProps } = children[
                index
              ].props;
              return (
                <ListItem key={key} style={style} {...childProps}>
                  {childProps.item.id}
                </ListItem>
              );
            }}
          />
        )}
      </AutoSizer>
    </Container>
  );
});
const json = require('../constants/all_course_name_list.json');
const allCourseCodes = Object.keys(json).reduce((memo, course) => {
  memo.push({ id: `${course} - ${json[course]}`, courseCode: course });
  return memo;
}, []);
console.log(allCourseCodes);
class SearchBar extends React.Component {
  render() {
    return (
      <StatefulSelect
        options={allCourseCodes}
        labelKey="id"
        valueKey="course"
        overrides={{
          Dropdown: {
            component: VirtualList,
          },
        }}
        onChange={event => {
          if (event.type === 'select')
            this.props.selectAClass(event.option.courseCode);
          else this.props.selectAClass(null);
        }}
        placeholder={'Choose a class...'}
        type={TYPE.search}
        initialState={{
          value: this.props.courseName ? [{ id: this.props.courseName }] : null,
        }}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  selectAClass: className => {
    dispatch(selectAClass(className));
  },
});

const mapStateToProps = state => ({
  courseName: state.selectedClass,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
