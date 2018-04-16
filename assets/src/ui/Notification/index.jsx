import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import Icon from '../Icon';

const TYPEMAP = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
};

export default function Notification({type, icon, className, children, viewBox, raised, title, ...props}) {
  return (
    <div {...props} className={classNames('Notification--root', `style--${type}`, className, {'style--raised': raised})}>
      <div className='graphic'>
        <Icon g={icon || TYPEMAP[type]} viewBox={viewBox} />
      </div>
      <div className='content'>
        <h5>{title}</h5>
        <p>{children}</p>
      </div>
    </div>
  )
}

Notification.defaultProps = {
  type: 'info',
  viewBox: '0 0 24 24',
  raised: false
}

Notification.propTypes = {
  raised: PropTypes.bool,
  viewBox: PropTypes.string,
  className: classNameShape,
  children: childrenShape,
  title: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(TYPEMAP)).isRequired,
  icon: PropTypes.oneOf(Object.values(TYPEMAP)),
  onClick: PropTypes.func
}
