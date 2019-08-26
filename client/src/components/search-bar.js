import React from 'react';
import { withStyle } from 'baseui';
import { StatefulSelect, StyledDropdownListItem, TYPE } from 'baseui/select';
import { StyledList } from 'baseui/menu';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { connect } from 'react-redux';
import { selectAClass } from '../reducers/mainUi';

// Needed for the selector component to display many options
const ListItem = withStyle(StyledDropdownListItem, {
  paddingTop: 0,
  paddingBottom: 0,
  display: 'flex',
  alignItems: 'center',
});
const ListItemMobile = withStyle(StyledDropdownListItem, {
  paddingTop: 0,
  paddingBottom: 0,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.0)',
  borderRadius: '100px',
});
const Container = withStyle(StyledList, {
  height: window.innerWidth <= 800 ? '150px' : '250px',
  // maxWidth: '570px',
  width: '100%',
  borderRadius: '30px',
});
const VirtualList = React.forwardRef((props, ref) => {
  const children = React.Children.toArray(props.children);
  return (
    <Container ref={ref} id="container">
      <AutoSizer>
        {({ width }) => (
          <List
            role={props.role}
            height={window.innerWidth <= 800 ? 150 : 250}
            width={width}
            rowCount={props.children.length || 0}
            rowHeight={36}
            rowRenderer={({ index, key, style }) => {
              const { resetMenu, getItemLabel, ...childProps } = children[
                index
              ].props;
              return window.innerWidth <= 800 ? (
                <ListItemMobile key={key} style={style} {...childProps}>
                  {childProps.item.label || childProps.item.id}
                </ListItemMobile>
              ) : (
                <ListItem key={key} style={style} {...childProps}>
                  {childProps.item.label || childProps.item.id}
                </ListItem>
              );
            }}
          />
        )}
      </AutoSizer>
    </Container>
  );
});

// Get all the course name and set up the options for the selector component
const courseCodeToCourseMap = require('../constants/all_course_name_list.json');
const allSelectOptions = Object.keys(courseCodeToCourseMap).reduce(
  (memo, courseCode) => {
    memo.push({
      id: courseCode,
      label: `${courseCode} - ${courseCodeToCourseMap[courseCode]}`,
    });
    return memo;
  },
  []
);
class SearchBar extends React.Component {
  render() {
    const { courseName, selectAClass, isMobile } = this.props;
    return (
      <StatefulSelect
        creatable
        options={allSelectOptions}
        labelKey="id"
        valueKey="label"
        overrides={{
          Dropdown: {
            component: VirtualList,
          },
          ControlContainer: {
            style: {
              borderRadius: '50px',
              maxWidth: '570px',
              height: courseName ? '30px' : null,
              alignItems: 'center',
            },
          },
          Popover: {
            props: {
              overrides: {
                Body: { style: { borderRadius: '30px', top: '-7px' } },
                Inner: { style: { borderRadius: '30px' } },
              },
            },
          },
          OptionContent: {
            style: {
              color: 'red',
            },
          },
        }}
        onChange={event => {
          if (event.type === 'select') selectAClass(event.option.id);
          else selectAClass(null);
        }}
        placeholder={
          courseName
            ? courseCodeToCourseMap[courseName]
              ? `${courseName} - ${courseCodeToCourseMap[courseName]}`
              : courseName
            : 'Type Course Code or Course Name Here...'
        }
        type={TYPE.search}
        size={isMobile ? 'compact' : 'default'}
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
  isMobile: state.isMobile,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
