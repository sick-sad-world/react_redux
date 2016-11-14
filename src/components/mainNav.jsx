import React from "React";
import { IndexLink } from "react-router";

export default class MainNav extends React.Component {

  render () {
    return (
      <nav className="mod-main-nav" id="funMainNav">
        <a href="" onClick={this.props.toggle} title="Toggle sidebar" data-icon="">Toggle sidebar</a>
        <span className="separator"></span>
        <IndexLink to="/" activeClassName="is-current" title="Dashboard" data-icon="">Dashboard</IndexLink>
        <IndexLink to="/columns" activeClassName="is-current" title="Columns list" data-icon="">Columns list</IndexLink>
        <IndexLink to="/sourcesets" activeClassName="is-current" title="Sourcesets list" data-icon="">Sourcesets list</IndexLink>
        <IndexLink to="/alerts" activeClassName="is-current" title="Alerts list" data-icon="">Alerts list</IndexLink>
        <IndexLink to="/reports" activeClassName="is-current" title="Reports list" data-icon="">Reports list</IndexLink>
        <IndexLink to="/settings" activeClassName="is-current" title="Settings" data-icon="">Settings</IndexLink>
        <span className="separator"></span>
        <a href="" onClick={this.props.logout} title="Logout" data-icon="">Logout</a>
      </nav>
    );
  }
}