import React from 'React';
import { Link } from 'react-router';
import Icon from './icon';

export default function MainNav (props) {
  return (
    <nav className='mod-main-nav' id='funMainNav'>
      <a href='' onClick={props.toggle} title='Toggle sidebar'>
        <Icon icon='menu' />
      </a>
      <span className='separator'></span>
      <Link to='/dashboard' activeClassName='is-current' title='Dashboard'>
        <Icon icon='home' />
        <span className='t-ellipsis'>Dashboard</span>
      </Link>
      <Link to='/columns' activeClassName='is-current' title='Columns list'>
        <Icon icon='archive' />
        <span className='t-ellipsis'>Columns list</span>
      </Link>
      <Link to='/sets' activeClassName='is-current' title='Sourcesets list'>
        <Icon icon='globe' />
        <span className='t-ellipsis'>Sourcesets list</span>
      </Link>
      <Link to='/alerts' activeClassName='is-current' title='Alerts list'>
        <Icon icon='paper-plane' />
        <span className='t-ellipsis'>Alerts list</span>
      </Link>
      <Link to='/reports' activeClassName='is-current' title='Reports list'>
        <Icon icon='news' />
        <span className='t-ellipsis'>Reports list</span>
      </Link>
      <Link to='/settings' activeClassName='is-current' title='Settings'>
        <Icon icon='cog' />
        <span className='t-ellipsis'>Settings</span>
      </Link>
      <span className='separator'></span>
      <a href='' onClick={props.logout} title='Logout'>
        <Icon icon='log-out' />
        <span className='t-ellipsis'>Logout</span>
      </a>
    </nav>
  );
}