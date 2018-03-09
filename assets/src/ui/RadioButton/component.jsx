import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, errorShape } from '../../shared/typings';
import styles from './styles.scss';

/** RadioButton input to choose some of many */
export default function RadioButton({ className, reverse, value, name, label, descr, focus, error, onChange, onFocus, onBlur, checked, ...props }) {
  const classes = {
    [styles['state--error']]: !!error,
    [styles['state--focus']]: focus,
    [styles['style--reverse']]: !!reverse
  };

  const id = `${name}-${value}`

  return (
    <div className={classNames(styles.root, classes, className)}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={styles.control}>
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
      {descr && <span className={styles.subtext}>{descr}</span>}
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
  /** Define whatever label should be rendered first */
  reverse: PropTypes.bool,
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
