import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './radial.scss';
import SvgSpinner from '../Spinner';

export default function RadialLoading({text, rootClassName, className, value, ...props}) {
  return (
    <div {...props} className={classNames(rootClassName, className)}>
      <SvgSpinner />
      {text && <span>{text.replace('$p', value)}</span>}
    </div>
  );
}

RadialLoading.defaultProps = {
  rootClassName: 'RadialLoading-root',
  text: 'Loading... $p%',
  value: 0
}

RadialLoading.propTypes = {
  rootClassName: PropTypes.string.isRequired,
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  text: PropTypes.string
}
