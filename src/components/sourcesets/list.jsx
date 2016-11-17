import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class List extends React.Component {

  render() {
    return (
      <div>Sourcesets list</div>
    );
  }
}

export default connect(({ sourcesets }) => {items: _.pluck(sourcesets, ["id", "name", "source_ids"])} )(List);