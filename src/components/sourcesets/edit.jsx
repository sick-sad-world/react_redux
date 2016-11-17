import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class Edit extends React.Component {

  render() {
    console.log("Sourceset edit update");
    return (
      <div>Sourceset edit form</div>
    );
  }
}

let mapStateToProps = ({ sourcesets, sources }, ownProps) => {
  let item = _.filter(sourcesets, {id: ownProps.location.query.id});
  return {
    item,
    sources: _.filter(sources, (source) => _.contains(item.source_ids, source.id))
  };
};

export default connect(mapStateToProps)(Edit);