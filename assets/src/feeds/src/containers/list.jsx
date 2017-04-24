// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { includes, bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import actions
// ===========================================================================
import { deleteFeed } from '../actions';


// Import child components
// ===========================================================================
import Feed from '../components/feed';

class FeedsList extends React.Component {


  render() {
    return (
      <ul className={this.props.className}>
        <li className='state-empty'>{this.props.emptyTpl}</li>
      </ul>
    );
  }
}

FeedsList.defaultProps = {
  className: 'entity-list',
  emptyTpl: 'No feeds found.'
};


FeedsList.propTypes = {
  emptyTpl: PropTypes.string.isRequired,
  className: PropTypes.string
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFeed(id) {
      return dispatch(deleteFeed({ id }));
    }
  };
}

export default connect(mapStateToProps(), mapDispatchToProps)(FeedsList);
