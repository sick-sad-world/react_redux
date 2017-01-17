import React from 'react';
import classNames from 'classnames';
import Icon from './icon';
import { capitalize } from 'lodash';

export default function Message (props) {
  let text = props.text;
  let className = classNames({
    'message': true,
    [`is-${props.type}`]: true
  });

  // Use defined text or compose new one
  // ===========================================================================
  if (typeof props.text !== 'string') {
    text = `${capitalize(props.actionText)} of ${props.entity} ${(props.entityId) ? 'ID: '+props.entityId : ''}`;
    if (props.type === 'loading') {
      text += ' in progress...';
    } else {
      text += ` ended with ${props.type}`;
    }
  }

  return (
    <li className={className}>
      <div className='icon'>
        { (props.type == 'loading') ? (<img src='/img/loading2.svg' />) : (<Icon icon={props.type} />) }
      </div>
      <div>
        <h5>{capitalize(props.type)}</h5>
        <p>{text}</p>
      </div>
      <a onClick={props.onClick} className='close'>
        <Icon icon='cross' />
      </a>
    </li>
  );
}