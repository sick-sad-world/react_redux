import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from 'common/components/icon';
import { capitalize } from 'lodash';
import { defaultData, defaultInterface } from '../defaults';
// import Loading from 'img/loading2.svg';

export default function Notification({ type, text, onClick }) {
  return (
    <li className={classNames({
      notification: true,
      [`is-${type}`]: true
    })}>
      <div className='icon'>
        { (type === 'loading') ? (<img src='/img/loading2.svg' />) : (<Icon viewBox='0 0 24 24' icon={type} />) }
      </div>
      <div>
        <h5>{capitalize(type)}</h5>
        <p>{text}</p>
      </div>
      <a onClick={onClick} className='close'>
        <Icon icon='cross' />
      </a>
    </li>
  );
}

Notification.defaultProps = {
  ...defaultData,
  onClick: null
};

Notification.propTypes = {
  ...defaultInterface,
  onClick: PropTypes.func
};
