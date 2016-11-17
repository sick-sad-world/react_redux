import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Assigment extends React.Component {

  render() {
    return (
      <div>Reports column assigment</div>
    );
  }
}

export default connect(({ reports, columns }, ownProps) => {columns: _.pluck(columns, ["id", "name"]), item: _.filter(reports, {id: ownProps.location.query.id})} )(Assigment);