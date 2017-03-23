// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import Icon from '../icon';

// Main app screen - Dashboard
// ===========================================================================
export default function Header ({name, refresh, settings}) {
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