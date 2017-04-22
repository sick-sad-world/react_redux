import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';
import Icon from 'common/components/icon';

export default function MainNav({ toggle, logout, routes }) {
  return (
    <nav className='mod-main-nav' id='funMainNav'>
      <a onClick={toggle} title='Toggle sidebar'>
        <Icon icon='menu' />
      </a>
      <span className='separator'></span>
      <IndexLink to='/' activeClassName='is-current' title='Dashboard'>
        <Icon icon='home' />
        <span className='t-ellipsis'>Dashboard</span>
      </IndexLink>
      { routes.map(({ icon, path, label }) => (
          <Link key={path} to={path} activeClassName='is-current' title={label}>
            <Icon icon={icon} />
            <span className='t-ellipsis'>{label}</span>
          </Link>
        ))}
      <span className='separator'></span>
      <a onClick={logout} title='Logout'>
        <Icon icon='log-out' />
        <span className='t-ellipsis'>Logout</span>
      </a>
    </nav>
  );
}

// Proptypes validation
// ===========================================================================
MainNav.propTypes = {
  toggle: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  routes: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};