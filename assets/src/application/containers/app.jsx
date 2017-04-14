// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import makeAppSelector from '../selectors';

// Import Child components
// ===========================================================================
import Notifications from 'src/notifications/containers';
import ClientError from '../components/client-error';
import ProgressTracker from '../components/progress-tracker';

// Import all required actions
// ===========================================================================
import { getUser } from 'src/user/actions';
import { getAllResults } from 'src/results/actions';
import { getColumnsForResults } from 'src/columns/reduser';
import { setAppState, fetchData } from '../actions';

// This is CORE APP Component
// It renders app if state > 1 or Progressbar if not
// ===========================================================================
class App extends React.Component {

  componentWillMount() {
    this.props.getInitialData();
  }

  render() {
    const { error, state, loadingStep } = this.props;
    return (
      <div>
        { (error) ? <ClientError error={error} /> : null }
        { (state === 1) ? <ProgressTracker step={loadingStep} /> : this.props.children }
        <Notifications/>
      </div>
    );
  }
}

App.defaultProps = {
  state: 1,
  loadingStep: 1
};

App.propTypes = {
  error: PropTypes.string,
  state: PropTypes.number.isRequired,
  loadingStep: PropTypes.number,
  children: PropTypes.element.isRequired,
  getInitialData: PropTypes.func.isRequired
};

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeAppSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = dispatch => ({
  getInitialData() {
    return dispatch(getUser(null, { state: false, notification: false }))
      .then(() => dispatch(fetchData()))
      .then(getColumnsForResults)
      .then(data => dispatch(getAllResults(data)))
      .catch(() => { console.log('Not logged in'); })
      .then(() => dispatch(setAppState(2)));
  }
});

export default connect(mapStateToProps(), mapDispatchToProps)(App);
