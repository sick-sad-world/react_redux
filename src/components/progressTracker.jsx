import React from "react";
import { connect } from "react-redux";

export default class ProgressTracker extends React.Component {
  render () {
    console.log("Progress tracker update");
    return <div className="progress-tracker"><img src="img/loading.svg" alt="Loading" /></div>;
  }
}

//export default connect(({app})=>({app}))(ProgressTracker);