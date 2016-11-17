import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Edit extends React.Component {

  render() {
    return (
      <div>Reports edit form</div>
    );
  }
}

export default connect(({ reports }, ownProps) => {item: _.filter(reports, {id: ownProps.location.query.id})} )(Edit);