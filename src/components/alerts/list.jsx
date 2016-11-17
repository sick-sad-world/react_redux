import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Alerts list</div>
    );
  }
}

export default connect(({ alerts }) => {items: _.pluck(alerts, ["id", "name", "columns"])} )(List);