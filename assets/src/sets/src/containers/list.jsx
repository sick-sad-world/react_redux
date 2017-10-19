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
import { critereaShape } from 'common/typecheck';
import { defaultInterface } from '../defaults';
import { makeListSelector } from '../selectors';

// Import child components
// ===========================================================================
import Sourceset from '../components/sourceset';

function SetsList({ payload, emptyTpl, children, className, sortable }) {
  return (
    <ul className={classNames('entity-list', className)}>
      {(payload.length) ? payload.map(set => (
        <Sourceset key={set.id} {...set} sortable={sortable}>
          {(children) ? children(set) : null}
        </Sourceset>
      )) : <li className='state-empty'>{emptyTpl}</li>}
    </ul>
  );
}

SetsList.defaultProps = {
  emptyTpl: 'No sets found.',
  sortable: false
};


SetsList.propTypes = {
  criterea: PropTypes.shape(critereaShape),
  sortable: PropTypes.bool.isRequired,
  children: PropTypes.func,
  className: PropTypes.string,
  emptyTpl: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
export default connect(makeListSelector)(SetsList);
