import React from 'react';
import Icon from '../icon';
import { Link } from 'react-router';

export default function composeListItem (props) {
  let visibilityLink;
  if (props.open) {
    visibilityLink = <a href='#toggleVisibility' title='Hide this Column'><Icon icon='eye-with-line' /></a>;
  } else {
    visibilityLink = <a href='#toggleVisibility' title='Show this Column'><Icon icon='eye' /></a>;
  }
  return (
    <li key={props.id} className='mod-entity'>
      <div>
        <Icon className='drag-handle' icon='dots-three-vertical' />
        <div className='text'>
          <Link to={{ pathname: '/columns/'+props.id }}> { props.name }</Link>
        </div>
        <nav className='nav-links'>
          {visibilityLink}
          <a href='#deleteItem' title='Delete this Column'>
            <Icon icon='trash' />
          </a>
        </nav>
      </div>
    </li>
  );
}