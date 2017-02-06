import React from 'React';
import { Link } from 'react-router';
import Icon from './icon';

export default function MainNav (props) {
  return (
    <nav className='mod-main-nav' id='funMainNav'>
      <a onClick={props.toggle} title='Toggle sidebar'>
        <Icon icon='menu' />
      </a>
      <span className='separator'></span>
      { props.routes.map(({icon, path, label}) => {
        return (
          <Link key={path} to={path} activeClassName='is-current' title={label}>
            <Icon icon={icon} />
            <span className='t-ellipsis'>{label}</span>
          </Link>
        );
      })}
      <span className='separator'></span>
      <a onClick={props.logout} title='Logout'>
        <Icon icon='log-out' />
        <span className='t-ellipsis'>Logout</span>
      </a>
    </nav>
  );
}