// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { critereaShape } from 'common/typecheck';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import child components
// ===========================================================================
import Feed from '../components/feed';

function FeedsList({ payload, sortable, children, className, emptyTpl }) {
  return (
    <ul className={classNames('entity-list', className)}>
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
  emptyTpl: 'No feeds found.',
  sortable: false
};


FeedsList.propTypes = {
  criterea: PropTypes.shape({
    ...critereaShape,
    uniq_ids: PropTypes.arrayOf(PropTypes.number)
  }),
  sortable: PropTypes.bool.isRequired,
  children: PropTypes.func,
  className: PropTypes.string,
  emptyTpl: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
export default connect(makeContainerSelector)(FeedsList);
