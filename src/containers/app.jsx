import React from "React";
import { connect } from "react-redux";

import ProgressTracker from "../components/progressTracker";

class App extends React.Component {
  render () {
    if (this.props.app.appState === 1) {
      return <ProgressTracker/>;
    } else {
      return this.props.children;
    }
  }
}

export default connect(({app})=>({app}))(App);