import React from 'react';
import { connect } from 'react-redux';

class UrlSync extends React.Component {
  componentDidUpdate() {
    const { courseName } = this.props;
    let newUrl = '/';
    if (courseName) {
      const [type, number] = courseName.split(' ');
      const params = new window.URLSearchParams();
      params.set('type', type);
      params.set('number', number);
      const paramsString = String(params);
      newUrl = `?${paramsString}`;
    }
    window.history.replaceState(window.history.state, '', newUrl);
  }
  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  courseName: state.selectedClass,
});

export default connect(
  mapStateToProps,
  null
)(UrlSync);
