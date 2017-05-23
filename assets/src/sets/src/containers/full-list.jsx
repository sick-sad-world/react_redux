// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { makeFullListSelector } from '../selectors';

// Import Child components
// ===========================================================================
import SetsWithContents from '../components/list';

export default connect(makeFullListSelector)(SetsWithContents);
