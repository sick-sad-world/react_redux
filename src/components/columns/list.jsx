import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Columns list</div>
    );
  }
}

export default connect(({ columns }) => {items: _.pluck(columns, ["id", "name", "open"])} )(List);