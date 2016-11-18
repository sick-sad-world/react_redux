import React from "react";

export default class ListItem extends React.Component {

  render () {
    return (
      <li>{this.props.id + ":" + this.props.name}</li>
    );
  }
} 