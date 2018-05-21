import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape } from 'shared/typings';
import './radial.scss';
import SvgSpinner from '../Spinner';

export default function RadialLoading({text, rootClassName, className, value, ...props}) {
  return (
    <div {...props} className={classNames(rootClassName, className)}>
      <SvgSpinner />
      {text && <span>{text.replace('$p', Math.round(value))}</span>}
    </div>
  );
}

RadialLoading.defaultProps = {
  rootClassName: 'RadialLoading-root',
  text: 'Loading... $p%',
  value: 0
}

RadialLoading.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  className: classNameShape,
  value: PropTypes.number.isRequired,
  text: PropTypes.string
}
