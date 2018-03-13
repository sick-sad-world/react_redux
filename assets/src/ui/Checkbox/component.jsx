import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, errorShape } from 'shared/typings';
import './styles.scss';
import Icon from '../Icon';

/** Checkbox input to choose some of many */
export default function Checkbox({ className, value, name, label, descr, focus, error, onChange, onFocus, onBlur, checked, ...props }) {
  const classes = {
    'state--error': !!error,
    'state--focus': !!focus
  };

  const id = `${name}-${value}`

  return (
    <div className={classNames('Checkbox--root', classes, className)}>
      <div className='body'>
        <div className='control'>
          <input
            {...props}
            type='checkbox'
            id={id}
            name={name}
            value={value}
            checked={isFunction(checked) ? checked({[name]: value}) : checked}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <Icon g='check' />
        </div>
        {label && <label htmlFor={id}>{label}</label>}
      </div>
      {descr && <span className='subtext'>{descr}</span>}
    </div>
  );
}

Checkbox.defaultProps = {
  value: '',
  focus: false,
  error: false,
  checked: false
};

Checkbox.propTypes = {
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** State of Checkbox */
  checked: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).isRequired,
  /** Value of input itself */
  value: PropTypes.string.isRequired,
  /** Name property for input */
  name: PropTypes.string.isRequired,
  /** Function invoked on change event */
  onChange: PropTypes.func.isRequired,
  /** Function invoked when input gaining focus */
  onFocus: PropTypes.func,
  /** Function invoked when input losing focus */
  onBlur: PropTypes.func,
  /** Whatever field is focused or not */
  focus: PropTypes.bool.isRequired,
  /** Field validation state mark it as valid [true] or invalid [Array[String]] */
  error: errorShape.isRequired
};
