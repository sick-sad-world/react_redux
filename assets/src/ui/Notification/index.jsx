import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import Icon from '../Icon';

const TYPEMAP = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
};

export default function Notification({type, icon, className, children, ...props}) {
  return (
    <div {...props} className={classNames('Notification--root', className)}>
      <Icon g={icon || TYPEMAP[type]} />
      <span>{children}</span>
    </div>
  )
}

Notification.defaultProps = {
  type: 'info'
}

Notification.propTypes = {
  className: classNameShape,
  children: childrenShape,
  type: PropTypes.oneOf(Object.keys(TYPEMAP)).isRequired,
  icon: PropTypes.oneOf(Object.values(TYPEMAP)),
  onClick: PropTypes.func
}
