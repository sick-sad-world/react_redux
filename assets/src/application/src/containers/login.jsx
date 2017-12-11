// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { initialLoading, setAppState } from '../actions';
import { stateNum } from 'common/typecheck';
import { makeAuthSelector } from '../selectors';
import { actions as userActions } from 'src/user';

// Import Child components
// ===========================================================================
import FormLogin from '../components/form-login';

// Authentification form
// ===========================================================================
function Login(props) {
  function handleAuth(data) {
    props.setAppState(3);
    props.login(data).then(() => props.initialLoading()).catch(console.error).then(() => props.setAppState(2));
  }

  return (
    <FormLogin loading={props.state !== 2} handler={handleAuth} />
  );
}

// Default props
// ===========================================================================
Login.defaultProps = {
  state: 2
};

// Proptypes validation
// ===========================================================================
Login.propTypes = {
  state: stateNum.isRequired,
  login: PropTypes.func.isRequired,
  setAppState: PropTypes.func.isRequired,
  initialLoading: PropTypes.func.isRequired
};

export default connect(makeAuthSelector, { login: userActions.login, initialLoading, setAppState })(Login);
