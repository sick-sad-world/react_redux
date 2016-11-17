import _ from "lodash";
import React from "React";
import { connect } from "react-redux";

class FeedCreation extends React.Component {

  render() {
    return (
      <div>Create new feed screen</div>
    );
  }
}

export default connect(({ sources }, ownProps) => {sources: _.pluck(sources, ["feed_url"]), set_id: ownProps.location.query.id} )(Assigment);