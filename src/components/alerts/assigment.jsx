import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Assigment extends React.Component {

  render() {
    return (
      <div>Alerts column assigment</div>
    );
  }
}

export default connect(({ alerts, columns }, ownProps) => {columns: _.pluck(columns, ["id", "name"]), item: _.filter(alerts, {id: ownProps.location.query.id})} )(Assigment);