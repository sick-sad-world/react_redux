import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Columns list</div>
    );
  }
}

class Edit extends React.Component {

  render() {
    return (
      <div>Columns edit form</div>
    );
  }
}

class Assigment extends React.Component {

  render() {
    return (
      <div>Columns feeds assigment</div>
    );
  }
}

export { List as list, Edit as main, Assigment as additional };