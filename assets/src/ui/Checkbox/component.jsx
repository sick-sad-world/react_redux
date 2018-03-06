import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, errorShape } from '../../shared/typings';
import styles from './styles.scss';

/** Checkbox input to choose some of all */
export default function Checkbox({ className, type, value, name, label, descr, prefix, suffix, focus, error, onChange, onFocus, onBlur, ...props }) {
  const classes = {
    [styles['state--error']]: !!error,
    [styles['state--focus']]: focus
  };

  return (
    <div className={classNames(styles.body, classes, className)}>
      {label && <label htmlFor={id}>{label}</label>}
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      <div className={styles[box]}>
        <input
          {...props}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
      {suffix && <span className={styles.suffix}>{suffix}</span>}
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
  error: errorShape.isRequired,
  /** Elements placed BEFORE field (icons, buttons) */
  prefix: PropTypes.element,
  /** Elements placed AFTER field (icons, buttons) */
  suffix: PropTypes.element
};
