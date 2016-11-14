import React from "react";
import { connect } from "react-redux";

class Profile extends React.Component {
  render() {
    return (
      <section className="mod-page" id="funUserProfile">
      </section>
    );
  }
};

export default connect()(Profile);