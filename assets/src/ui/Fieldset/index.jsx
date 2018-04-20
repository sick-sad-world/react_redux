import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { childrenShape, classNameShape } from 'shared/typings';
import './styles.scss';

export default function Fieldset({ title, collapsable, children, className, rootClassName, ...props }) {
  return (
    <fieldset {...props} className={classNames(rootClassName, className)}>
      {title && <legend>{title}</legend>}
      <div className='body'>
        {children}
      </div>
    </fieldset>
  );
}

Fieldset.defaultProps = {
  rootClassName: 'Fieldset--root',
  collapsable: false
}

Fieldset.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Contents of fieldset */
  children: childrenShape,
  /** Class names added to root component */
  className: classNameShape,
  /** Define whatever fieldset should be able to collapse in accordion style */
  collapsable: PropTypes.bool.isRequired,
  /** Title of fieldset - rendered as <legend/> */
  title: PropTypes.string,
}