import React from "React";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import MainNav from "../components/mainNav";
import UserBlock from "../components/userBlock";

class App extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.isLoggedIn) {
      this.props.router.replace("/auth");
    }

    this.state = {
      sidebar: this.props.sidebar || true
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  toggleSidebar(e) {
    e.preventDefault();
    this.setState({sidebar: !this.state.sidebar});
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
        <aside className={ "sidebar " + sidebarStateClass }>
          <UserBlock />
          <MainNav toggle={this.toggleSidebar} logout={this.logoutHandler} />
        </aside>
        <div className="screen-content">
          { list }
          { main }
          { additional }
        </div>
      </section>
    ) : null;
  }
}

function mapStateToProps(state) {
  let user = state.user || {};
  //user.workspace.sidebar
  return {
    sidebar: true,
    isLoggedIn: user.id
  };
}

export default connect(mapStateToProps)(App);