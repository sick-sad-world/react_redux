// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import ProgressTracker from '../components/progress-tracker';
import ClientError from '../components/client-error';
import Notifications from './notifications';

// Import all required actions
// ===========================================================================
import { getUser } from '../redux/user';
import { setAppState, fetchData, getAllResults } from '../redux/app';

// This is CORE APP Component
// It renders app if state > 1 or Progressbar if not
// ===========================================================================
class App extends React.Component {

  componentWillMount() {
    this.props.getInitialData();
  }

  render () {
    return (
      <div>
        { (this.props.error) ? <ClientError error={this.props.error} /> : null }
        { (this.props.state === 1) ? <ProgressTracker step={this.props.loadingStep} /> : this.props.children }
        <Notifications/>
      </div>
    );
  }

}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
const mapStateToProps = ({app}) => ({...app});

const mapDispatchToProps = (dispatch) => ({
  getInitialData () {
    dispatch(getUser(null, {state: false, notification: false}))
      .then(() => dispatch(fetchData()))
      .then((data) => {
        console.log(data);
        return dispatch(getAllResults(data))
      })
      .catch(() => {console.log('Not logged in');})
      .then(() => dispatch(setAppState(2)));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);