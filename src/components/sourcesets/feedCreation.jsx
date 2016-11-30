import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class FeedCreation extends React.Component {

  render() {
    return (this.props.set_id && this.props.params.create) ? (
      <div>Create new feed screen</div>
    ) : null;
  }
}

let mapStateToProps = ({ sources }, ownProps) => ({
  sources: _.map(sources, (item) => item.feed_url),
  set_id: parseInt(ownProps.params.id)
});

export default connect(mapStateToProps)(FeedCreation);