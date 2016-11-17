import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Edit extends React.Component {

  render() {
    return (
      <div>Alerts edit form</div>
    );
  }
}

export default connect(({ alerts }, ownProps) => {item: _.filter(alerts, {id: ownProps.location.query.id})} )(Edit);