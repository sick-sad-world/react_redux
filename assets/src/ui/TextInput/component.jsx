import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, validationMessageShape } from 'shared/typings';
import './styles.scss';

const TYPES = ['text', 'email', 'number', 'password'];

/** Input of type: TEXT, EMAIL, NUMBER, PASSWORD implementation */
export default function TextInput({ className, type, value, name, label, descr, prefix, suffix, helper, focus, error, onChange, onFocus, onBlur, rootClassName, ...props }) {
  return (
    <div className={classNames(rootClassName, className)}>
      {prefix && <span className='prefix'>{prefix}</span>}
      <div className='body'>
        <label>
          <input
            {...props}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {label && <span className='label'>{label}</span>}
          {helper && <span className='helper'>{helper}</span>}
        </label>
        {(error || descr) ? (
          <span className='subtext'>{error || descr}</span>
          ) : null}
      </div>
      {suffix && <span className='suffix'>{suffix}</span>}
    </div>
  );
}

TextInput.defaultProps = {
  rootClassName: 'TextInput--root',
  type: 'text',
  focus: false,
  error: false
}

TextInput.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Type property of an input */
  type: PropTypes.oneOf(TYPES).isRequired,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** Value of input itself */
  value: PropTypes.string,
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
  error: validationMessageShape.isRequired,
  /** Elements placed at the end of field (icons, buttons) */
  helper: PropTypes.element,
  /** Elements placed BEFORE field (icons, buttons) */
  prefix: PropTypes.element,
  /** Elements placed AFTER field (icons, buttons) */
  suffix: PropTypes.element
}
