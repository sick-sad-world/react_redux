// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import DragHandle from 'common/components/drag-handle';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { childrenShape } from 'common/typecheck';

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export default function Sourceset({ sortable, name, counter, disabled, children }) {
  return (
    <li className={classNames({
      'mod-entity': true,
      'mod-sourceset': true,
      'is-disabled': disabled
    })}>
      <div>
        { (sortable) ? <DragHandle /> : null }
        <div className='text'>
          <span className='title'>
            <em className='counter'>{counter}</em> { name }
          </span>
        </div>
        {(children) ? (
          <nav className='nav-links'>{children}</nav>
        ) : null}
      </div>
    </li>
  );
}

Sourceset.defaultProps = {
  sortable: true,
  disabled: false
};

Sourceset.propTypes = {
  name: PropTypes.string.isRequired,
  counter: PropTypes.number.isRequired,
  sortable: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  children: childrenShape
};
