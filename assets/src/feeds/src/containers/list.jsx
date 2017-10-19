// Import utility stuff
// ===========================================================================

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import child components
// ===========================================================================
import Feed from '../components/feed';

function FeedsList({ payload, sortable, children, className, emptyTpl }) {
  return (
    <ul className={className}>
      {(payload.length) ? (
        payload.map(feed => (
          <Feed key={feed.id} {...feed} sortable={sortable}>{children(feed)}</Feed>
        ))
      ) : (
        <li className='state-empty'>{emptyTpl}</li>
        )}
    </ul>
  );
}

FeedsList.defaultProps = {
  className: 'entity-list',
  emptyTpl: 'No feeds found.',
  deletable: true,
  sortable: false
};


FeedsList.propTypes = {
  criterea: PropTypes.shape({
    source_ids: PropTypes.arrayOf(PropTypes.number),
    uniq_ids: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.arrayOf(PropTypes.number),
    seach: PropTypes.string
  }),
  set_id: PropTypes.number,
  deletable: PropTypes.bool.isRequired,
  sortable: PropTypes.bool.isRequired,
  children: PropTypes.func,
  className: PropTypes.string,
  emptyTpl: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired,
  deleteFeed: PropTypes.func.isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
export default connect(makeContainerSelector)(FeedsList);
