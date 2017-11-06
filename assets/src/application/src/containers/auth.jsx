// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { stateNum } from 'common/typecheck';
import { makeAuthSelector } from '../selectors';
import { Link } from 'react-router';

// Authentification screen containing both of auth forms
// ===========================================================================
class Auth extends React.Component {

  // Redirect to auth if user is authentificated
  // ===========================================================================
  componentWillMount() {
    this.indexRedirect(this.props);
  }

  // Redirect to auth if user is authentificated
  // ===========================================================================
  componentWillReceiveProps(newProps) {
    this.indexRedirect(newProps);
  }

  indexRedirect(props) {
    if (props.auth && props.state === 2) {
      this.props.router.replace('/');
    }
  }

  render() {
    const { children } = this.props;

    return (
      <section className='screen-auth mod-authentification' id='funAuthScreen'>
        <div className='auth-forms'>
          <img className='logotype' src='img/logo.svg' title='Trendolier pro' alt='Trendolizer pro' />
          <nav className='tab-list'>
            <Link to='/login' activeClassName='is-current'>Log in</Link>
            <Link to='/register' activeClassName='is-current'>Register</Link>
          </nav>
          {children}
        </div>
      </section>
    );
  }
}

// Default props
// ===========================================================================
Auth.defaultProps = {
  state: 2
};

// Proptypes validation
// ===========================================================================
Auth.propTypes = {
  state: stateNum.isRequired,
  auth: PropTypes.bool.isRequired,
  children: PropTypes.element,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired
};

export default connect(makeAuthSelector)(Auth);
