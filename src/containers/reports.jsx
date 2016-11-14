import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Reports list</div>
    );
  }
}

class Edit extends React.Component {

  render() {
    return (
      <div>Reports edit form</div>
    );
  }
}

class Assigment extends React.Component {

  render() {
    return (
      <div>Reports column assigment</div>
    );
  }
}

export { List as list, Edit as main, Assigment as additional };