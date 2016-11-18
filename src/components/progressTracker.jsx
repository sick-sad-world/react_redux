import React from "react";

export default class ProgressTracker extends React.Component {
  render () {
    console.log("Progress tracker update");
    return <div className="progress-tracker">Loading...</div>;
  }
}