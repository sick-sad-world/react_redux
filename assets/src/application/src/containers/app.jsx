// Import React related stuff
// ===========================================================================
import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeAppSelector } from '../selectors';

// Import Child components
// ===========================================================================
import { Container as Notifications } from 'src/notifications';
import ClientError from '../components/client-error';

// Import all required actions
// ===========================================================================
import { initialLoading, clientError } from '../actions';

// This is CORE APP Component
// It renders app if state > 1 or Progressbar if not
// ===========================================================================
class App extends React.Component {

  componentWillMount() {
    window.onerror = this.props.clientError;
    this.props.initialLoading(true);
  }

  render() {
    const { error, children } = this.props;
    return (
      <div>
        { (error) ? <span className='overlay'><ClientError error={error} /></span> : null }
        {children}
        <Notifications/>
      </div>
    );
  }
}

// Default props
// ===========================================================================
App.defaultProps = {
  state: 1
};

// Proptypes validation
// ===========================================================================
App.propTypes = {
  error: PropTypes.string,
  state: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired,
  initialLoading: PropTypes.func.isRequired,
  clientError: PropTypes.func.isRequired
};

export default connect(makeAppSelector, { clientError, initialLoading })(App);
