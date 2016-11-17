import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Reports list</div>
    );
  }
}

export default connect(({ reports }) => {items: _.pluck(reports, ["id", "name", "columns"])} )(List);