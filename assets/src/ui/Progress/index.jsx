import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import { childrenShape } from 'shared/typings';
import RadialLoading from './radial';
import LinearLoading from './linear';

const TYPES = {
  radial: RadialLoading,
  linear: LinearLoading
} 

function toggleLoading({ loading }) {
  return { loading: !loading }
}

/** Loading component render spinner or  */
export default class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.buffer = null;
    bindAll(this, 'toggleLoading');
  }

  componentWillReceiveProps({loading, buffer}) {
    if (loading && !this.props.loading) {
      if (buffer > 0) {
        this.buffer = setTimeout(this.toggleLoading, buffer)
      } else {
        this.toggleLoading();
      }
    } else if (!loading && this.props.loading) {
      clearTimeout(this.buffer);
      this.buffer = null;
      this.toggleLoading();
    }
  }

  toggleLoading() {
    this.setState(toggleLoading);
  }

  render() {
    const { children, type, buffer, ...props } = this.props;
    
    if (!this.state.loading) {
      return children;
    }

    const Loading = TYPES[type];
    
    return <Loading {...props} />;
  }
}

Progress.defaultProps = {
  children: null,
  type: 'radial',
  loading: false,
  buffer: 200,
  value: 0
}

Progress.propTypes = {
  /** Component to render if not loading */
  children: childrenShape.isRequired,
  /** Whatever the loading in process */
  loading: PropTypes.bool.isRequired,
  /** Buffer time on which loading rendering will be delayed to avoid flashing */
  buffer: PropTypes.number.isRequired,
  /** What spinner to use Radial or linear */
  type: PropTypes.oneOf(Object.keys(TYPES)).isRequired,
  /** Amount of progress */
  value: PropTypes.number.isRequired
}

