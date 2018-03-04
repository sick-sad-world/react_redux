import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNamesTyping } from '../../shared/typings';
import styles from './styles.scss';

const TYPE = ['button', 'input', 'link'];
const THEMES = ['default', 'secondary', 'success', 'error', 'warning', 'info'];

export default function Button({ el, children, className, theme, ...props }) {
  const classList = classNames({
    [styles.button]: true,
    [styles[theme]]: true
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
  theme: 'default'
};

Button.propTypes = {
  /** What element use a button root */
  el: PropTypes.oneOf(TYPE).isRequired,
  /** Color theme of a button */
  theme: PropTypes.oneOf(THEMES).isRequired,
  /** Additional class names */
  className: classNamesTyping,
  /** Content of a button (text, child elements, icons, e.t.c) */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element, PropTypes.string])
};
