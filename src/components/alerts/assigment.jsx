import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Assigment extends React.Component {

  render() {
    console.log("Alert assigment update");
    return (
      <div>Alerts column assigment</div>
    );
  }
}

let mapStateToProps = ({ alerts, columns }, ownProps) => ({
  columns: _.map(columns, (item)=>_.pick(item, ["id", "name"])),
  item: _.filter(alerts, {id: ownProps.location.query.id})
});

export default connect(mapStateToProps)(Assigment);