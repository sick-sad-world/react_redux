// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'common/components/icon';

// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Agnostinc list item component
// @using by: ListView and Management views
// ===========================================================================
export default function Sourceset({ sortable, name, counter, buttons, disabled }) {
  return (
    <li className={classNames({
      'mod-entity': true,
      'mod-sourceset': true,
      'is-disabled': disabled,
      'is-expanded': !!this.props.children
    })}>
      <div>
        { (sortable) ? <Icon className='drag-handle' icon='dots-three-vertical' /> : null }
        <div className='text'>
          <span className='title'>
            { (counter) ? <em className='counter'>{counter}</em> : null } { name }
          </span>
        </div>
        { (buttons && buttons.length) ? <nav className='nav-links'>{buttons}</nav> : null }
      </div>
      {this.props.children}
    </li>
  );
}

Sourceset.propTypes = {
  name: PropTypes.string.isRequired,
  counter: PropTypes.number,
  sortable: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  buttons: PropTypes.oneOfType(PropTypes.element, PropTypes.arrayOf(PropTypes.element))
};
