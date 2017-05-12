// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import Icon from 'common/components/icon';

// Main app screen - Dashboard
// ===========================================================================
export default function ItemHeader({ name, refresh, settings }) {
  return (
    <header className='column-header'>
      <Icon className='drag-handle' icon='dots-three-vertical' />
      <h1 className='funName'>{name}</h1>
      <nav className='nav-links'>
        <a title='Refresh column' onClick={refresh}><Icon icon='cw' /></a>
        <a onClick={settings} title='Column settings'><Icon icon='cog' /></a>
      </nav>
    </header>
  );
}

ItemHeader.propTypes = {
  name: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  settings: PropTypes.func.isRequired
};
