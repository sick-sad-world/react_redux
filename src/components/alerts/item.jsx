import React from 'react';
import Icon from '../icon';
import { Link } from 'react-router';

export default function composeListItem (props) {
  return (
    <li key={props.id} className='mod-entity'>
      <div>
        <Icon className='drag-handle' icon='dots-three-vertical' />
        <div className='text'>
          <Link to={{ pathname: '/alerts/'+props.id }}><em className="counter">{props.columns.length}</em> { props.name }</Link>
        </div>
        <nav className='nav-links'>
          <a href='#deleteItem' title='Delete this Alert'>
            <Icon icon='trash' />
          </a>
        </nav>
      </div>
    </li>
  );
}