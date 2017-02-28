import React from 'react';
import classNames from 'classnames';
import Icon from './icon';
import { capitalize } from 'lodash';

export default function Notification (props) {
  return (
    <li className={classNames({
      'notification': true,
      [`is-${props.type}`]: true
    })}>
      <div className='icon'>
        { (props.type == 'loading') ? (<img src='/img/loading2.svg' />) : (<Icon viewBox='0 0 24 24' icon={props.type} />) }
      </div>
      <div>
        <h5>{capitalize(props.type)}</h5>
        <p>{props.text}</p>
      </div>
      <a onClick={props.onClick} className='close'>
        <Icon icon='cross' />
      </a>
    </li>
  );
}