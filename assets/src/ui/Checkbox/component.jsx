import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, errorShape } from '../../shared/typings';
import styles from './styles.scss';
import Icon from '../Icon';

/** Checkbox input to choose some of all */
export default function Checkbox({ className, value, name, label, descr, prefix, suffix, focus, error, onChange, onFocus, onBlur, ...props }) {
  const classes = {
    [styles['state--error']]: !!error,
    [styles['state--focus']]: focus
  };


  const checked = isFunction(checked) ? checked({[name]: value}) : checked;

  return (
    <div className={classNames(styles.root, classes, className)}>
      <label>
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.figure}>
          <input
            {...props}
            type='checkbox'
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <Icon g='check' />
        </div>
      </label>
      {descr && <span className={styles.subtext}>{descr}</span>}
    </div>
  );
}

Checkbox.defaultProps = {
  value: '',
  focus: false,
  error: false
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
