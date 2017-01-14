import React from 'react';
import classNames from 'classnames';

export default function Message (props) {
  let className = classNames({
    'message': true,
    ''
  })
  return (
    <li } className={className}>
      <span className='text'>Are you sure about that?</span>
      <p>
        <a href='' onClick={props.handlerDelete} className='button'>Delete</a>
        <span onClick={props.handlerCancel} className='button is-accent'>Cancel</span>
      </p>
    </li>
  );
}