import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape } from 'shared/typings';
import './styles.scss';

const TYPE = ['button', 'input', 'link'];
const THEMES = ['lined', 'secondary', 'secondary-lined', 'success', 'success-lined', 'error', 'error-lined', 'warning', 'warning-lined', 'info', 'info-lined'];

/** UI Button implementation */
export default function Button({ el, children, className, theme, ...props }) {
  const classList = classNames({
    Button: true,
    [theme]: !!theme
  }, className);

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
  el: 'button',
  mode: false
};

Button.propTypes = {
  /** What element use a button root */
  el: PropTypes.oneOf(TYPE).isRequired,
  /** Color theme of a button */
  theme: PropTypes.oneOf(THEMES),
  /** Additional class names */
  className: classNameShape,
  /** Content of a button (text, child elements, icons, e.t.c) */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element, PropTypes.string])
};
