import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Sourcesets list</div>
    );
  }
}

class Edit extends React.Component {

  render() {
    return (
      <div>Sourcesets edit form</div>
    );
  }
}

class FeedCreation extends React.Component {

  render() {
    return (
      <div>Sourcesets feed creation</div>
    );
  }
}

export { List as list, Edit as main, FeedCreation as additional };