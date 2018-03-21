import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.scss';

export function ProgressRadial({className, rootClassName}) {
  return (
    <svg className={classNames(rootClassName, className)} width='65px' height='65px' viewBox='0 0 66 66'>
      <circle className='path' fill='none' strokeWidth='6' strokeLinecap='round' cx='33' cy='33' r='30' />
    </svg>
  );
}

ProgressRadial.defaultProps = {
  rootClassName: 'ProgressRadial-root'
}

ProgressRadial.propTypes = {
  rootClassName: PropTypes.string.isRequired,
  className: PropTypes.string
}

export function ProgressLinear() {

}

ProgressLinear.propTypes = {
  
}