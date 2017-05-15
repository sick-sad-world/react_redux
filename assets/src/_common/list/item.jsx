// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';

// Import child components
// ===========================================================================
import { Link } from 'react-router';
import DragHandle from '../components/drag-handle';
import { Delete } from '../components/buttons';

// Agnostinc list item component
// @using by: ListView
// ===========================================================================
function ListItem({ disabled, current, url, name, id, counter, customIcon, deleteAction, deleteText, ...props }) {
  return (
    <li className={classNames({
      'mod-entity': true,
      'is-selected': current === id && !disabled,
      'is-disabled': disabled && current !== id
    })}>
      <div>
        <DragHandle />
        <div className='text'>
          <Link to={ (current === id) ? url : `${url}/${id}` }>
            {(counter >= 0) ? <em className='counter'>{counter}</em> : null} { name }
          </Link>
        </div>
        {(customIcon || deleteAction) ? (
          <nav className='nav-links'>
          { (customIcon) ? customIcon({ name, id, ...props }) : null }
          { (deleteAction) ? <Delete handler={deleteAction} title={deleteText} /> : null }
          </nav>
        ) : null }
      </div>
    </li>
  );
}

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  counter: PropTypes.number,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  current: PropTypes.number,
  deleteText: PropTypes.string,
  customIcon: PropTypes.func,
  deleteAction: PropTypes.func
};

export default SortableElement(ListItem);
