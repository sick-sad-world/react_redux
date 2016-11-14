import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Alerts list</div>
    );
  }
}

class Edit extends React.Component {

  render() {
    return (
      <div>Alerts edit form</div>
    );
  }
}

class Assigment extends React.Component {

  render() {
    return (
      <div>Alerts column assigment</div>
    );
  }
}

export { List as list, Edit as main, Assigment as additional };