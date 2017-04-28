// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'common/components/icon';
import { ExpandSet, CollapseSet, SelectSet } from './buttons';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export default function Sourceset({ sortable, name, counter, disabled, children, select, onExpand }) {
  let Toggler = null;
  if (onExpand) {
    if (children) {
      Toggler = <CollapseSet handler={onExpand} />;
    } else {
      Toggler = <ExpandSet handler={onExpand} />;
    }
  }

  return (
    <li className={classNames({
      'mod-entity': true,
      'mod-sourceset': true,
      'is-disabled': disabled,
      'is-expanded': !!children
    })}>
      <div>
        { (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null }
        <div className='text'>
          <span className='title'>
            <em className='counter'>{counter}</em> { name }
          </span>
        </div>
        {(select || Toggler) ? (
          <nav className='nav-links'>
            { (select) ? <SelectSet handler={select} /> : null }
            { Toggler }
          </nav>
        ) : null}
      </div>
      {children}
    </li>
  );
}

Sourceset.defaultProps = {
  sortable: true,
  disabled: false
};

Sourceset.propTypes = {
  name: PropTypes.string.isRequired,
  counter: PropTypes.number,
  sortable: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.element,
  select: PropTypes.func,
  deselect: PropTypes.func,
  onExpand: PropTypes.func
};
