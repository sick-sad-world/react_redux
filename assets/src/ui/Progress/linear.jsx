import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { classNameShape } from 'shared/typings';
import './linear.scss';

export default function LinearLoading({rootClassName, className, value, text }) {
  return (
    <div className={cn(rootClassName, className)}>
      <span className='bar'>
        <span style={{width: `${value}%`}} className='value' />
      </span>
      {text && <span>{text.replace('$p', Math.round(value))}</span>}
    </div>
  )
}

LinearLoading.defaultProps = {
  rootClassName: 'LinearLoading-root',
  text: 'Loading... $p%',
  value: 0
}

LinearLoading.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  className: classNameShape,
  value: PropTypes.number.isRequired,
  text: PropTypes.string
}