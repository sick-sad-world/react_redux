// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import SetsWithContents from '../components/list';

export default connect(({ sets }) => ({ data: sets.payload }))(SetsWithContents);
