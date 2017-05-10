// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { listShape } from 'common/typecheck';
import { path } from '../defaults';
import { makeNavSelector } from '../selectors';

function DashboardNav({ payload, base }) {
  return (
    <div className='nav-dashboards'>
      {payload.map(({ id, name, counter }) => (
        <Link key={id} to={`${base}/${id}`} activeClassName='is-current' title={name}>
          <em className='counter'>{counter}</em>
          <span className='t-ellipsis'>{name}</span>
        </Link>
      ))}
    </div>
  );
}

DashboardNav.defaultProps = {
  base: path
};

DashboardNav.propTypes = {
  base: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired
};

// Connect our Container to State
// @ deps -> Dashboard
// ===========================================================================
function mapStateToProps() {
  const selector = makeNavSelector();
  return (state, props) => selector(state, props);
}

export default connect(mapStateToProps())(DashboardNav);
