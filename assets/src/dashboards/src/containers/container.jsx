// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

function Dashboard() {
  return (
    <section className='dashboard'>

    </section>
  );
}

Dashboard.defaultProps = {
};

Dashboard.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Dashboards
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

export default connect(mapStateToProps())(Dashboard);
