import React from "react";
import { connect } from "react-redux";

class Dashboard extends React.Component {
  render() {
    return (
      <section className="mod-page" id="funDashboard">
      </section>
    );
  }
};

export default connect()(Dashboard);