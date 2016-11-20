import React from "react";
import Icon from "./icon";
import { Link } from "react-router";

export default class ListItem extends React.Component {
  render () {
    return (
      <li className="mod-entity">
        <div>
          <Icon className="drag-handle" icon="dots-three-vertical" />
          <div className="text">
            <Link to={{ pathname: "/"+this.props.type+"/"+this.props.id }}>{ this.props.name }</Link>
          </div>
          <nav className="nav-links">
            <a href="#deleteItem" title="Delete this Column">
              <Icon icon="trash" />
            </a>
          </nav>
        </div>
      </li>
    );
  }
} 