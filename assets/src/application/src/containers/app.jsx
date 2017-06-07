// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import makeAppSelector from '../selectors';

// Import Child components
// ===========================================================================
import { Container as Notifications } from 'src/notifications';
import ClientError from '../components/client-error';
import ProgressTracker from '../components/progress-tracker';

// Import all required actions
// ===========================================================================
import { getUser } from 'src/user';
import { getAllResults } from 'src/results';
import { getColumnsForResults } from 'src/columns';
import { setAppState, fetchData, clientError } from '../actions';

// This is CORE APP Component
// It renders app if state > 1 or Progressbar if not
// ===========================================================================
class App extends React.Component {

  componentWillMount() {
    window.onerror = this.props.clientError;
    this.props.getInitialData();
  }

  render() {
    const { error, state, loadingStep } = this.props;
    return (
      <div>
        { (error) ? <span className='overlay'><ClientError error={error} /></span> : null }
        { (state === 1) ? <ProgressTracker step={loadingStep} /> : this.props.children }
        <Notifications/>
      </div>
    );
  }
}

// Default props
// ===========================================================================
App.defaultProps = {
  state: 1,
  loadingStep: 1
};

// Proptypes validation
// ===========================================================================
App.propTypes = {
  error: PropTypes.string,
  state: PropTypes.number.isRequired,
  loadingStep: PropTypes.number,
  children: PropTypes.element.isRequired,
  getInitialData: PropTypes.func.isRequired,
  clientError: PropTypes.func.isRequired
};

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeAppSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = dispatch => ({
  clientError(...args) {
    return dispatch(clientError(...args));
  },
  getInitialData() {
    return dispatch(getUser(null, { state: false, notification: false }))
      .then(() => dispatch(fetchData()))
      .then(getColumnsForResults)
      .then(data => dispatch(getAllResults(data)))
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        } else {
          console.log('Not logged in');
        }
      })
      .then(() => dispatch(setAppState(2)));
  }
});

export default connect(mapStateToProps(), mapDispatchToProps)(App);
