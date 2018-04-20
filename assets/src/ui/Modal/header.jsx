import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import IconButton from '../IconButton';

export default function ModalHeader({className, title, onClose, children, rootClassName, ...props}) {
  return (
    <header {...props} className={classNames(, className)}>
      <div className='line'>
        <h4>{title}</h4>
        <IconButton g='cross' onClick={onClose} />
      </div>
      {children}
    </header>
  )
}

ModalHeader.defaultProps = {
  rootClassName: 'ModalHeader--root'
}

ModalHeader.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  className: classNameShape,
  children: childrenShape,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func
}