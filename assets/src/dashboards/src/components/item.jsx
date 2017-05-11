// Import helper stuff
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';

// Import child components
// ===========================================================================

export default class DashboardItem extends React.component {
  constructor(props) {
    super(props);
    this.state ={
      open: false
    };
  }
  render() {
    return ();
  }
}