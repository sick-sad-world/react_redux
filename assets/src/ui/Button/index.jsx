import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';

const TYPE = ['button', 'input', 'link'];
const THEMES = ['raised', 'secondary', 'secondary-raised', 'success', 'success-raised', 'error', 'error-raised', 'warning', 'warning-raised', 'info', 'info-raised'];

/** UI Button implementation */
export default function Button({ el, children, rootClassName, className, theme, ...props }) {
  const classList = classNames(rootClassName, theme, className);

  switch (el) {
    case 'input':
      return <input type='button' {...props} className={classList} />;
    case 'link':
      return <a {...props} className={classList} >{children}</a>;
    case 'button':
    default:
      return <button {...props} className={classList} >{children}</button>;
  }
}

Button.defaultProps = {
  rootClassName: 'Button-root',
  el: 'button',
  mode: false
}

Button.propTypes = {
  /** Root className of component */
  rootClassName: PropTypes.string.isRequired,
  /** What element use a button root */
  el: PropTypes.oneOf(TYPE).isRequired,
  /** Color theme of a button */
  theme: PropTypes.oneOf(THEMES),
  /** Additional class names */
  className: classNameShape,
  /** Content of a button (text, child elements, icons, e.t.c) */
  children: childrenShape
}
