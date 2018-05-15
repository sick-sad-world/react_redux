// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { critereaShape } from 'common/typecheck';
import { coreInterface } from '../defaults';
import { makeListSelector } from '../selectors';

// Import Child components
// ===========================================================================
import makeSearchable from 'common/hocs/searchable';
import { Expand, Collapse } from 'common/components/buttons';
import Sourceset from '../components/sourceset';

export class ComposedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: null
    };
  }

  updateOpen(id) {
    return () => this.setState({ open: (this.state.open === id) ? null : id });
  }

  makeToggleBtn({ id }, isOpen) {
    return (isOpen) ? (
      <Collapse onClick={this.updateOpen(id)} />
    ) : (
      <Expand onClick={this.updateOpen(id)} />
    );
  }

  render() {
    const { payload, emptyTpl, className, sortable, children, actions } = this.props;
    return (
      <ul className={classNames('entity-list', className)}>
        {(payload.length) ? (
          payload.reduce((acc, set) => {
            const isOpen = this.state.open && set.id === this.state.open;
            acc.push(
              <Sourceset key={set.id} {...set} sortable={sortable}>
                {actions ? actions(set, isOpen) : null}
                {children ? this.makeToggleBtn(set, isOpen) : null}
              </Sourceset>
            );
            if (children && isOpen) {
              acc.push(
                <li key={`${set.id}-content`} className='mod-entity'>
                  {children(set)}
                </li>
              );
            }
            return acc;
          }, [])
        ) : (
          <li className='state-empty'>{emptyTpl}</li>
          )}
      </ul>
    );
  }
}

ComposedList.defaultProps = {
  sortable: false,
  emptyTpl: 'No sets found'
};

ComposedList.propTypes = {
  criterea: PropTypes.shape(critereaShape),
  actions: PropTypes.func,
  className: PropTypes.string,
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  sortable: PropTypes.bool.isRequired,
  emptyTpl: PropTypes.string.isRequired,
  children: PropTypes.func
};


// export const SearchableSetsList = makeSearchable(FullSetsList);

export default connect(makeListSelector)(ComposedList);
