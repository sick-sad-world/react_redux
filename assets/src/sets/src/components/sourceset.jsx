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
export default function Sourceset({ sortable, name, counter, buttons, disabled, children, action, onExpand }) {
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
        {(action || onExpand) ? (
          <nav className='nav-links'>
            { (action) ? <a onClick={action.handler} title={action.title}><Icon icon={action.name} /></a> : null }
            { (onExpand) ? <a onClick={onExpand} title='View contents'><Icon icon={(children) ? 'chevron-up' : 'chevron-down'} /></a> : null }
          </nav>
        ) : null}
        { (buttons && buttons.length) ? <nav className='nav-links'>{buttons}</nav> : null }
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
  expanded: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.element,
  buttons: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  action: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired
  }),
  onExpand: PropTypes.func
};
