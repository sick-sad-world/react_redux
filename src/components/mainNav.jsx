import React from "React";
import { IndexLink } from "react-router";
import Icon from "../helpers/icon";

export default class MainNav extends React.Component {

  render () {
    return (
      <nav className="mod-main-nav" id="funMainNav">
        <a href="" onClick={this.props.toggle} title="Toggle sidebar">
          <Icon icon="menu" />
        </a>
        <span className="separator"></span>
        <IndexLink to="/" activeClassName="is-current" title="Dashboard">
          <Icon icon="home" />
          <span className="t-ellipsis">Dashboard</span>
        </IndexLink>
        <IndexLink to="/columns" activeClassName="is-current" title="Columns list">
          <Icon icon="archive" />
          <span className="t-ellipsis">Columns list</span>
        </IndexLink>
        <IndexLink to="/sourcesets" activeClassName="is-current" title="Sourcesets list">
          <Icon icon="globe" />
          <span className="t-ellipsis">Sourcesets list</span>
        </IndexLink>
        <IndexLink to="/alerts" activeClassName="is-current" title="Alerts list">
          <Icon icon="paper-plane" />
          <span className="t-ellipsis">Alerts list</span>
        </IndexLink>
        <IndexLink to="/reports" activeClassName="is-current" title="Reports list">
          <Icon icon="news" />
          <span className="t-ellipsis">Reports list</span>
        </IndexLink>
        <IndexLink to="/settings" activeClassName="is-current" title="Settings">
          <Icon icon="cog" />
          <span className="t-ellipsis">Reports list</span>
        </IndexLink>
        <span className="separator"></span>
        <a href="" onClick={this.props.logout} title="Logout">
          <Icon icon="log-out" />
          <span className="t-ellipsis">Logout</span>
        </a>
      </nav>
    );
  }
}