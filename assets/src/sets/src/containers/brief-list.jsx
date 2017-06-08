// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { makeListSelector } from '../selectors';

// Import Child components
// ===========================================================================
import LimitedList from 'common/components/limited-list';

export default connect(makeListSelector)(LimitedList);
