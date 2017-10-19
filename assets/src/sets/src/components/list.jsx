// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { coreInterface } from '../defaults';

// Import Child components
// ===========================================================================
import { Expand, Collapse } from 'common/components/buttons';
import Sourceset from './sourceset';

export default class SetsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: null
    };
  }

  updateOpen(id) {
    return () => this.setState({ open: (this.state.open === id) ? null : id });
  }

  render() {
    const { payload, emptyTpl, className, sortable, children } = this.props;
    return (
      <ul className={classNames('entity-list', className)}>
        {(payload.length) ? (
          payload.reduce((acc, set) => {
            const isOpen = this.state.open && set.id === this.state.open;
            acc.push(
              <Sourceset key={set.id} name={set.name} counter={set.source_ids.length} sortable={sortable} >
                {(isOpen) ? <Collapse onClick={this.updateOpen(set.id)} /> : <Expand onClick={this.updateOpen(set.id)} /> }
              </Sourceset>
            );
            if (isOpen && children) {
              acc.push(children(set));
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

SetsList.defaultProps = {
  sortable: false,
  emptyTpl: 'No sets found'
};

SetsList.propTypes = {
  className: PropTypes.string,
  payload: PropTypes.arrayOf(PropTypes.shape(coreInterface)).isRequired,
  sortable: PropTypes.bool.isRequired,
  emptyTpl: PropTypes.string.isRequired,
  children: PropTypes.func
};
