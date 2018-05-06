import bindAll from 'lodash/bindAll';
import debounce from 'lodash/debounce';
import React from 'react';
import PropTypes from 'prop-types';
import { childrenShape } from 'shared/typings';
import RadialLoading from './radial';
import LinearLoading from './linear';

const TYPES = {
  radial: RadialLoading,
  linear: LinearLoading
}

export const BUFFER = 200;

function resetState() {
  return { loading: false, value: 0 }
}

function isLoading() {
  return { loading: true }
}

function makeFakePercentage({value}) {
  if (value) {
    return { value: value + ((100 - value) * 0.25) }
  } else {
    return { value: 12.5 }
  }
}

/** Loading component render spinner or  */
export default class Progress extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'activateLoading', 'setState', 'activateCounter');
    this.state = {
      value: 0,
      loading: false
    }
    this.counter = null;
    this.activateLoading = debounce(this.activateLoading, BUFFER);
  }

  componentWillMount() {
    if (this.props.loading) {
      this.activateLoading();
    }
  }

  componentWillReceiveProps({loading}) {
    if (!this.props.loading && loading) {
      this.activateLoading();
    } else if (this.props.loading && !loading) {
      this.activateLoading.cancel();
      this.deactivateLoading();
    }
  }

  componentWillUnmount() {
    this.activateLoading.cancel();
    clearInterval(this.counter);
  }

  activateCounter() {
    if (this.props.value !== 'auto' || !this.state.loading) return;
    this.counter = setInterval(() => this.setState(makeFakePercentage), 500);
  }

  activateLoading() {
    this.setState(isLoading, this.activateCounter);
  }

  deactivateLoading() {
    clearInterval(this.counter);
    this.setState(resetState)
  }

  render() {
    const { children, type, value, loading, ...props } = this.props;
    
    if (!this.state.loading) {
      return children;
    }

    const Loading = TYPES[type];
    
    return <Loading {...props} value={(value === 'auto') ? this.state.value : value} />;
  }

}

Progress.defaultProps = {
  children: null,
  type: 'radial',
  loading: false,
  value: 'auto'
}

Progress.propTypes = {
  /** Component to render if not loading */
  children: childrenShape.isRequired,
  /** Whatever the loading in process */
  loading: PropTypes.bool.isRequired,
  /** What spinner to use Radial or linear */
  type: PropTypes.oneOf(Object.keys(TYPES)).isRequired,
  /** Amount of progress */
  value: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired
}

