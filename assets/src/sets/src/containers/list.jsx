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
import { makeListSelector } from '../selectors';

// Import child components
// ===========================================================================
import Sourceset from '../components/sourceset';

class SetsList extends React.Component {

  render() {
    return (
      <ul className={this.props.className}>
        {(this.props.payload.length) ? this.props.payload.map(set => (
          <Sourceset key={set.id} name={set.name} counter={set.source_ids.length} disabled={set.disabled} sortable={this.props.sortable}>
            {(this.props.children) ? this.props.children(set) : null}
          </Sourceset>
        )) : <li className='state-empty'>{this.props.emptyTpl}</li>}
      </ul>
    );
  }

}

SetsList.defaultProps = {
  className: 'entity-list',
  emptyTpl: 'No sets found.',
  sortable: false
};


SetsList.propTypes = {
  criterea: PropTypes.shape({
    disabled: PropTypes.arrayOf(PropTypes.number),
    set_ids: PropTypes.arrayOf(PropTypes.number),
    seach: PropTypes.string
  }),
  sortable: PropTypes.bool.isRequired,
  children: PropTypes.func,
  className: PropTypes.string,
  state: stateNum.isRequired,
  emptyTpl: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
export default connect(makeListSelector)(SetsList);
