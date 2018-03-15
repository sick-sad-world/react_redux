import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, validationMessageShape } from 'shared/typings';
import './styles.scss';

/** RadioButton input to choose some of many */
export default function RadioButton({ className, value, name, label, descr, focus, error, onChange, onFocus, onBlur, checked, ...props }) {

  const id = `${name}-${value}`

  return (
    <div className={classNames('RadioButton--root', className)}>
      <div className='body'>
        <div className='control'>
          <input
            {...props}
            type='radio'
            id={id}
            name={name}
            value={value}
            checked={isFunction(checked) ? checked({[name]: value}) : checked}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <span />
        </div>
        {label && <label htmlFor={id}>{label}</label>}
      </div>
      {descr && <span className='subtext'>{descr}</span>}
    </div>
  );
}

RadioButton.defaultProps = {
  value: '',
  focus: false,
  error: false,
  checked: false
};

RadioButton.propTypes = {
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** State of RadioButton */
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
  error: validationMessageShape.isRequired
};
