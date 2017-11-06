// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { stateNum } from 'common/typecheck';
import { makeAuthSelector } from '../selectors';
import { addUser } from 'src/user';

// Import Child components
// ===========================================================================
import FormRegister from '../components/form-register';
// import Logotype from 'img/logo.svg';

// Registration form
// ===========================================================================
function Register({ state, addUser }) {
  return (
    <FormRegister loading={state !== 2} handler={(data = {}) => addUser({ ...data, redirect: window.location.host })} />
  );
}

// Default props
// ===========================================================================
Register.defaultProps = {
  state: 2
};

// Proptypes validation
// ===========================================================================
Register.propTypes = {
  state: stateNum.isRequired,
  addUser: PropTypes.func.isRequired
};

export default connect(makeAuthSelector, { addUser })(Register);
