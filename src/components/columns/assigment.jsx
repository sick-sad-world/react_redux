import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Assigment extends React.Component {

  render() {
    return (
      <div>Columns sources assigment</div>
    );
  }
}

export default connect(({ columns, sources }, ownProps) => {sources: _.pluck(sources, ["id", "name", "source_ids"]), item: _.filter(columns, {id: ownProps.location.query.id})} )(Assigment);