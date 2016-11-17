import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Edit extends React.Component {

  render() {
    console.log("Column edit update");
    return (
      <div>Columns edit form</div>
    );
  }
}

let mapStateToProps = ({ columns }, ownProps) => ({
  item: _.filter(columns, {id: ownProps.location.query.id})
});

export default connect(mapStateToProps)(Edit);