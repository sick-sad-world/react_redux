import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';

export default function ModalFooter({className, children, ...props}) {
  return (
    <footer {...props} className={classNames('ModalFooter--root', className)}>
      {children}
    </footer>
  )
}

ModalFooter.propTypes = {
  className: classNameShape,
  children: childrenShape
}