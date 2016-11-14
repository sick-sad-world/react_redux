import React from "React";
import { connect } from "react-redux";
import { browserHistory } from "react-router";

class CheckAuth extends React.Component {
  componentDidMount() {
    if (!this.props.isLoggedIn) {
      browserHistory.replace("/auth");
    }
  }

  render() {
    return (this.props.isLoggedIn) ? (
      <section className="screen-main mod-screen-main" id="funMainScreen">
        <aside className="sidebar is-expanded">
          /* User block */
          /* Main Nav */
        </aside>
        <div className="screen-content">
          {this.props.children}
        </div>
      </section>
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user && state.user.id,
  };
}

export default connect(mapStateToProps)(CheckAuth);