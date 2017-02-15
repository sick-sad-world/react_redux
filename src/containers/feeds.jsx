// Import helpers
// ===========================================================================

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import child components
// ===========================================================================
import FeedsList from '../components/list/feeds';

// Email injectable Component - provide list of user Emails whatever it need
// ===========================================================================
class Feeds extends React.Component {
  render () {
    return (
      <FeedsList
        sets={this.props.sets}
        sources={this.props.sources}
        disable={this.props.disable}
        action={this.props.action}
      />
    );
  }
}


// Connect our Container to State
// @ deps -> User
// ===========================================================================
const mapStateToProps = ({sets, sources}) => ({
  set_state: sets.state,
  source_state: sources.state,
  sets: sets.payload,
  sources: sources.payload
});

export default connect(mapStateToProps)(Feeds);
