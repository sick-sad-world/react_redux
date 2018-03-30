import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './linear.scss';

export default function LinearLoading({rootClassName, className, value, text }) {
  return (
    <div className={classNames(rootClassName, className)}>
      {text && <span>{text.replace('$p', value)}</span>}
      <progress value={value} max='100' />
    </div>
  )
}

LinearLoading.defaultProps = {
  rootClassName: 'LinearLoading-root',
  text: 'Loading... $p%',
  value: 0
}

LinearLoading.propTypes = {
  rootClassName: PropTypes.string.isRequired,
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  text: PropTypes.string
}