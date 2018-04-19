import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';

export default function ModalFooter({className, children, rootClassName, ...props}) {
  return (
    <footer {...props} className={classNames(rootClassName, className)}>
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
  className: classNameShape,
  children: childrenShape
}