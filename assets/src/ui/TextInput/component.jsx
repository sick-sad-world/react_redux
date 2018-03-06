import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, errorShape } from '../../shared/typings';
import styles from './styles.scss';

const TYPES = ['text', 'email', 'number', 'password'];

/** Input of type: TEXT, EMAIL, NUMBER, PASSWORD implementation */
export default function TextInput({ className, type, value, name, label, descr, prefix, suffix, focus, error, onChange, onFocus, onBlur, ...props }) {
  const classes = {
    [styles['state--error']]: !!error,
    [styles['state--focus']]: focus
  };

  return (
    <div className={classNames(styles.body, classes, className)}>
      <label>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          {...props}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {label && <span className={styles.label}>{label}</span>}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </label>
      <hr/>
      {(error || descr) ? (
        <span className={styles.subtext}>{error || descr}</span>
      ) : null}
    </div>
  );
}

TextInput.defaultProps = {
  type: 'text',
  value: '',
  focus: false,
  error: false
};

TextInput.propTypes = {
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Type property of an input */
  type: PropTypes.oneOf(TYPES).isRequired,
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
