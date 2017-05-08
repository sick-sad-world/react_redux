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

  renderSet(set) {
    return (
      <Sourceset
        {...set}
        key={set.id}
        select={this.props.select}
        deselect={this.props.deselect}
        disabled={this.props.disabled && includes(this.props.disabled, set.id)}
        sortable={false}
      />
    );
  }

  render() {
    return (
      <ul className={this.props.className}>
        {(this.props.payload.length) ? this.props.payload.map(this.renderSet) : <li className='state-empty'>{this.props.emptyTpl}</li>}
      </ul>
    );
  }

}

SetsList.defaultProps = {
  className: 'entity-list',
  emptyTpl: 'No sets found.',
  select: null,
  deselect: null
};


SetsList.propTypes = {
  criterea: PropTypes.shape({
    source_ids: PropTypes.arrayOf(PropTypes.number),
    uniq_ids: PropTypes.arrayOf(PropTypes.number),
    seach: PropTypes.string
  }),
  disabled: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.element,
  select: PropTypes.func,
  deselect: PropTypes.func,
  className: PropTypes.string,
  state: stateNum.isRequired,
  emptyTpl: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Feeds
// ===========================================================================
function mapStateToProps() {
  const selector = makeListSelector();
  return (state, props) => selector(state, props);
}
export default connect(mapStateToProps())(SetsList);
