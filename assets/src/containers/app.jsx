// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import ProgressTracker from '../components/progress-tracker';
import Notifications from './notifications';

// This is CORE APP Component
// It renders app if state > 1 or Progressbar if not
// ===========================================================================
class App extends React.Component {
  render () {
    return (
      <div>
        { (this.props.error) ? (
          <div className='global-error'>
            <h3>Oops! Error encountered</h3>
            <p>{this.props.error}</p>
            <small>Please contact us and provide details. So we able to fix it.</small>
          </div>
        ) : null }
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