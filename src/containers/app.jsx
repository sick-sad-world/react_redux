import _ from "lodash";
import classNames from "classnames";
import React from "React";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import getUser from "../selectors/user";
import MainNav from "../components/mainNav";
import UserBlock from "../components/userBlock";



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: this.props.sidebar || true
    };

    _.bindAll(this, ["toggleSidebar", "logoutHandler"]);
  }

  checkAuthState(auth) {
    !auth && this.props.router.push("/auth")
  }

  componentWillMount() {
    this.checkAuthState(this.props.isLoggedIn);
  }

  componentWillUpdate(newProps) {
    this.checkAuthState(newProps.isLoggedIn);
  }

  toggleSidebar(e) {
    e.preventDefault();
    this.setState({ sidebar: !this.state.sidebar });
    e.target.blur();
    e.target.parentNode.blur();
  }

  logoutHandler(e) {
    e.preventDefault();
    this.props.dispatch(logout());
  }

  render() {
    let { list, main, additional } = this.props;
    let sidebarClass = classNames({
      "sidebar": true,
      "is-expanded": this.state.sidebar
    });
    
    return (this.props.isLoggedIn) ? (
      <section className="screen-main mod-screen-main" id="funMainScreen">
        <aside className={sidebarClass}>
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
  let user = getUser(state);
  return {
    isLoggedIn: user.id,
    sidebar: true
  };
}

export default connect(mapStateToProps)(App);