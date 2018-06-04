import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import Icon from '../Icon';

const TYPEMAP = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
};

/** Notification for display and explain system states and events */
export default function Notification({type, icon, className, children, viewBox, raised, title, rootClassName, ...props}) {
  return (
    <div {...props} className={cn(rootClassName, `style--${type}`, className, {'style--raised': raised})}>
      <div className='graphic'>
        <Icon g={icon || TYPEMAP[type]} viewBox={viewBox} />
      </div>
      <div className='content'>
        <h5>{title}</h5>
        {children && <p>{children}</p>}
      </div>
    </div>
  )
}

Notification.defaultProps = {
  rootClassName: 'Notification--root',
  type: 'info',
  viewBox: '0 0 24 24',
  raised: false
}

Notification.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Define if we should apply specific class to make notification "raised" */
  raised: PropTypes.bool,
  /** Viewbox for Icon of notification, since we can customze it and adjustment may required */
  viewBox: PropTypes.string,
  /** Classname will be applied to Root element */
  className: classNameShape,
  /** Body of notification */
  children: childrenShape,
  /** Title of notification */
  title: PropTypes.string.isRequired,
  /** Type of notification - affects on styling */
  type: PropTypes.oneOf(Object.keys(TYPEMAP)).isRequired,
  /** With a help of this prop you can override default icon */
  icon: PropTypes.string,
}
