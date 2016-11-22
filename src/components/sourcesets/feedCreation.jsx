import _ from 'lodash';
import React from 'React';
import { connect } from 'react-redux';

class FeedCreation extends React.Component {

  render() {
    if (!this.props.set_id && !this.props.params.create) return null;
    console.log('Feed creation update');
    return (
      <div>Create new feed screen</div>
    );
  }
}

let mapStateToProps = ({ sources }, ownProps) => ({
  sources: _.map(sources, (item) => item.feed_url),
  set_id: parseInt(ownProps.params.id)
});

export default connect(mapStateToProps)(FeedCreation);