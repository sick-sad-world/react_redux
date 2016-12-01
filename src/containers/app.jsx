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
  render () {
    return (this.props.appState < 2) ? <ProgressTracker /> : this.props.children;
  }
}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
export default connect(({app}) =>({userState: app.userState, appState: app.appState}))(App);