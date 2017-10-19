// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import DragHandle from 'common/components/drag-handle';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';
import { childrenShape } from 'common/typecheck';
import IconBtns from 'common/components/buttons';

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export default function Sourceset({ sortable, name, counter, className, children }) {
  return (
    <li className={classNames('mod-entity', 'mod-sourceset', className)}>
      <div>
        { (sortable) ? <DragHandle /> : null }
        <div className='text'>
          <span className='title'>
            <em className='counter'>{counter}</em> { name }
          </span>
        </div>
        {(children) ? (
          <nav className='nav-links'>
            {children}
          </nav>
        ) : null}
      </div>
    </li>
  );
}

Sourceset.defaultProps = {
  sortable: true
};

Sourceset.propTypes = {
  name: PropTypes.string.isRequired,
  counter: PropTypes.number.isRequired,
  sortable: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: childrenShape
};
