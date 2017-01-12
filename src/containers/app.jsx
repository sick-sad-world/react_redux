// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import ProgressTracker from '../components/progressTracker';

// This is CORE APP Component
// It renders app if state > 1 or Progressbar if not
// ===========================================================================
class App extends React.Component {

  componentWillUpdate(nextProps) {
    // Set up boolean values for each condition
    // login, logout, root path
    // ===========================================================================
    let isRoot = this.props.location.pathname === '/';
    let logOut = this.props.userState && !nextProps.userState;
    let logIn = !this.props.userState && nextProps.userState;

    // Set proper redirects
    // ===========================================================================
    if ((isRoot && !nextProps.userState) || this.props.state >= 2 && logOut) {
      this.props.router.push('/auth');
    } else if ((isRoot && nextProps.userState) || this.props.state >= 2 && logIn) {
      this.props.router.push('/dashboard');
    }
  }

  render () {
    let { actionState, loadingStep } = this.props;
    return (this.props.state === 1) ? <ProgressTracker text={actionState} step={loadingStep} /> : this.props.children;
  }

}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
export default connect(({app}) => ({...app}))(App);