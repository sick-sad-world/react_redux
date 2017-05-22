// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import DragHandle from 'common/components/drag-handle';
import Icon from 'common/components/icon';

// Main app screen - Dashboard
// ===========================================================================
export default function ItemHeader({ name, refresh, toggle }) {
  return (
    <header className='column-header'>
      <DragHandle />
      <h1 className='funName'>{name}</h1>
      <nav className='nav-links'>
        {(refresh) ? <a onClick={() => refresh()} title='Refresh column'><Icon icon='cw' /></a> : null }
        {(toggle) ? <a onClick={toggle} title='Column settings'><Icon icon='cog' /></a> : null }
      </nav>
    </header>
  );
}

ItemHeader.propTypes = {
  name: PropTypes.string.isRequired,
  refresh: PropTypes.func,
  toggle: PropTypes.func
};
