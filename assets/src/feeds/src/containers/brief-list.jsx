// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { makeContainerSelector } from '../selectors';

// Import Child components
// ===========================================================================
import LimitedList from 'common/components/limited-list';

export default connect(makeContainerSelector)(LimitedList);
