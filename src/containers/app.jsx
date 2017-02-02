// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import ProgressTracker from '../components/progressTracker';
import Notifications from './notifications';

// This is CORE APP Component
// It renders app if state > 1 or Progressbar if not
// ===========================================================================
class App extends React.Component {
  render () {
    return (
      <div>
        { (this.props.state === 1) ? <ProgressTracker step={this.props.loadingStep} /> : this.props.children }
        <Notifications/>
      </div>
    );
  }
}

// Transform app state to component props
// @ deps -> App
// ===========================================================================
export default connect(({app}) => ({...app}))(App);