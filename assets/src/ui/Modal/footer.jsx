import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';

/** Footer part of Modal, Here can be placed some additional controls */
export default function ModalFooter({className, children, rootClassName, ...props}) {
  return (
    <footer {...props} className={cn(rootClassName, className)}>
      {children}
    </footer>
  )
}

ModalFooter.defaultProps = {
  rootClassName: 'ModalFooter--root'
}

ModalFooter.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** ClassNames applied to <footer/> element */
  className: classNameShape,
  /** Contents for footer */
  children: childrenShape
}