import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';

const THEMES = ['', 'accent', 'action', 'error', 'warning', 'success', 'info', 'html', 'rss', 'facebook', 'reddit', 'twitter'];

/** UI Badge implementation */
export default function Badge({rootClassName, raised, className, children, theme, ...props}) {
  const classes = classNames(rootClassName, theme, {
    'style--raised': raised
  }, className);

  return (
    <samp className={classes} {...props}>{children}</samp>
  );
}

Badge.defaultProps = {
  rootClassName: 'Badge--root',
  raised: false,
  theme: ''
}

Badge.propTypes = {
  /** Root className of component */
  rootClassName: PropTypes.string.isRequired,
  /** Content of a button (text, child elements, icons, e.t.c) */
  children: childrenShape,
  /** Additional class names */
  className: classNameShape,
  /** Define whatever to apply raised styles to badge */
  raised: PropTypes.bool,
  /** Theme of a badge */
  theme: PropTypes.oneOf(THEMES)
}