import React from 'react';
import classNames from 'classnames';
import Icon from './icon';

export default function Message (props) {
  let text = props.text;
  let type = props.type.split(' ')[0];
  let className = classNames({
    'message': true,
    [`is-${type}`]: true
  });

  if (typeof props.text !== 'string') {
    text = `${props.actionText} of ${props.entity} ${(props.entityId) ? 'ID: '+props.entityId : ''}`;
    if (props.type === 'loading') {
      text += ' in progress...';
    } else {
      text += ` ended with ${props.type}`;
    }
  }

  return (
    <li className={className}>
      { (props.type == 'loading') ? (<img src='' className='icon' />) : (<Icon className='icon' icon={type} />) }
      <div>
        <h5>{props.type}</h5>
        <p>{text}</p>
      </div>
      <a onClick={props.onClick} className='close'>
        <Icon icon='cross' />
      </a>
    </li>
  );
}