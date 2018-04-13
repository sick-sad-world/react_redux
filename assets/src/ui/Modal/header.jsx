import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '../IconButton';

export default function ModalHeader({className, title, onClose, children, ...props}) {
  return (
    <header {...props} className={classNames('ModalHeader-root', className)}>
      <div className='line'>
        <h3>{title}</h3>
        <IconButton g='cross' onClick={onClose} />
      </div>
      {children}
    </header>
  )
}