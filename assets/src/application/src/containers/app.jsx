import bindAll from 'lodash/bindAll';

// Import React related stuff
// ===========================================================================
import React from 'react';
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
  constructor(props) {
    super(props);
    this.load = 0;
    bindAll(this, 'loadStep');
  }

  loadStep() {
    this.load += 1;
    if (this.load === 2 || this.props.state === 2) {
      document.body.removeAttribute('class');
      window.removeEventListener('load', this.loadStep);
    }
  }

  componentWillMount() {
    window.onerror = this.props.clientError;
    window.addEventListener('load', this.loadStep);
    this.props.initialLoading().catch(console.error).then(this.loadStep);
  }


  render() {
    const { error, children, state } = this.props;
    return (
      <div>
        { (error) ? <span className='overlay'><ClientError error={error} /></span> : null }
        {(state > 1) ? children : null}
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
