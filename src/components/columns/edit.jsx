import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Edit extends React.Component {

  render() {
    return (
      <div>Columns edit form</div>
    );
  }
}

export default connect(({ columns }, ownProps) => {item: _.filter(columns, {id: ownProps.location.query.id})} )(Edit);