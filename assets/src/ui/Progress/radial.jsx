import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './radial.scss';

export default function RadialSpinner({text, rootClassName, className, value, ...props}) {
  return (
    <div {...props} className={classNames(rootClassName, className)}>
      <svg className='figure' width='65px' height='65px' viewBox='0 0 66 66'>
        <circle className='path' fill='none' strokeWidth='6' strokeLinecap='round' cx='33' cy='33' r='30' />
      </svg>
      {text && <span>{text.replace('$p', value)}</span>}
    </div>
  );
}

RadialSpinner.defaultProps = {
  rootClassName: 'RadialSpinner-root',
  text: 'Loading... $p%',
  value: 0
}

RadialSpinner.propTypes = {
  rootClassName: PropTypes.string.isRequired,
  className: PropTypes.string,
  value: PropTypes.number.isRequired,
  text: PropTypes.string
}
