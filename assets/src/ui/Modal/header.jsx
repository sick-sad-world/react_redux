import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import IconButton from '../IconButton';

export default function ModalHeader({className, title, onClose, children, ...props}) {
  return (
    <header {...props} className={classNames('ModalHeader--root', className)}>
      <div className='line'>
        <h4>{title}</h4>
        <IconButton g='cross' onClick={onClose} />
      </div>
      {children}
    </header>
  )
}

ModalHeader.propTypes = {
  className: classNameShape,
  children: childrenShape,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func
}