// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

function Dashboard({ payload, emptyTpl }) {
  return (
    <section className='mod-dashboard'>
    {(!payload) ? <emptyTpl/> : JSON.stringify(payload)}
    </section>
  );
}

Dashboard.defaultProps = {
  emptyTpl: <div className='state-empty'>Oups... Dashboard not found</div>
};

Dashboard.propTypes = {
  payload: PropTypes.shape(defaultInterface).isRequired,
  emptyTpl: PropTypes.element.isRequired
};

// Connect our Container to State
// @ deps -> Dashboards
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

export default connect(mapStateToProps())(Dashboard);
