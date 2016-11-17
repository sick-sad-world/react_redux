import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Assigment extends React.Component {

  render() {
    console.log("Report assigment update");
    return (
      <div>Reports column assigment</div>
    );
  }
}

let mapStateToProps = ({ reports, columns }, ownProps) => ({
  columns: _.map(columns, (item) => _.pick(item, ["id", "name"])),
  item: _.filter(reports, {id: ownProps.location.query.id})
});

export default connect(mapStateToProps)(Assigment);