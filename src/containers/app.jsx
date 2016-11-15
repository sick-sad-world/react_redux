import _ from "lodash";
import React from "React";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import { logout } from "../actions/auth";
import MainNav from "../components/mainNav";
import UserBlock from "../components/userBlock";



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: this.props.sidebar || true
    };
  }

  checkAuthState(auth) {
    if (!auth) {
      browserHistory.push("/auth");
    }
  }

  componentWillMount() {
    _.bindAll(this, ['toggleSidebar', 'logoutHandler']);
    this.checkAuthState(this.props.isLoggedIn);
  }

  componentWillUpdate(newProps) {
    this.checkAuthState(newProps.isLoggedIn);
  }

  toggleSidebar(e) {
    e.preventDefault();
    this.setState({ sidebar: !this.state.sidebar });
  }

  logoutHandler(e) {
    e.preventDefault();
    this.props.dispatch(logout());
  }

  render() {
    let { list, main, additional } = this.props;
    let sidebarStateClass = (this.state.sidebar) ? "is-expanded" : "";
    return (this.props.isLoggedIn) ? (
      <section className="screen-main mod-screen-main" id="funMainScreen">
        <aside className={"sidebar " + sidebarStateClass}>
          <UserBlock />
          <MainNav toggle={this.toggleSidebar} logout={this.logoutHandler} />
        </aside>
        <div className="screen-content">
          {list}
          {main}
          {additional}
        </div>
      </section>
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.id,
    sidebar: true
  };
}

export default connect(mapStateToProps)(App);