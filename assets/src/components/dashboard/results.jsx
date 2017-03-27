import { isEqual } from 'lodash';
import React from 'react';
import Results from '../../containers/results'

// Hoc container for results
// ===========================================================================
export default class ResultsContainer extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.infinite !== nextProps.infinite ||
      this.props.autoreload !== nextProps.autoreload ||
      this.props.sort !== nextProps.sort ||
      !isEqual(this.props.display_settings, nextProps.display_settings)
    );
  }

  render () {
    return (
      <Results {...this.props} />
    );
  }
}