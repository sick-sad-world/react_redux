// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { makeFullListSelector } from '../selectors';

// Import Child components
// ===========================================================================
import SetsWithContents from '../components/list';

function mapStateToProps() {
  const selector = makeFullListSelector();
  return (state, props) => selector(state, props);
}

export default connect(mapStateToProps())(SetsWithContents);
