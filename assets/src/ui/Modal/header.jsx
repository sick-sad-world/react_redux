import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import IconButton from '../IconButton';

/** Predefined Modal Header component */
export default function ModalHeader({className, title, onClose, children, rootClassName, ...props}) {
  return (
    <header {...props} className={cn(rootClassName, className)}>
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
  /** ClassNames applied to <header/> element */
  className: classNameShape,
  /** Additional contents for header (<Tabs/> for example) */
  children: childrenShape,
  /** Title of modal window */
  title: PropTypes.string.isRequired,
  /** Function invoked when [Close] button is clicked */
  onClose: PropTypes.func.isRequired
}