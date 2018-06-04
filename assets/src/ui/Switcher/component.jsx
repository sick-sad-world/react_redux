import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { classNameShape, validationMessageShape, optionShape, valueShape } from 'shared/typings';
import './styles.scss';

/** Switcher input to choose some of many */
export default function Switcher({ className, value, name, label, descr, focus, error, onChange, onFocus, onBlur, options, rootClassName, ...props }) {

  const id = `${name}-${value}`;

  const inputs = [];
  
  (options || []).forEach((item, i) => {

    const key = `${name}-${i}`;
    const chk = item.value === value;
    const eId = (chk) ? id : null;

    inputs.push(
      <input
        {...props}
        type='radio'
        key={key}
        title={item.label}
        id={eId}
        name={name}
        value={i}
        checked={chk}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  });

  return (
    <div className={cn(rootClassName, className)}>
      <div className='body'>
        {label && <label htmlFor={id}>{label}</label>}
        <div className='control'>
          {inputs}
          <span className='handle' />
          <span className='track' />
        </div>
      </div>
      {descr && <span className='subtext'>{descr}</span>}
    </div>
  );
}

Switcher.defaultProps = {
  rootClassName: 'Switcher--root',
  value: '',
  focus: false,
  error: false,
}

Switcher.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** Options to choose from */
  options: optionShape.isRequired,
  /** Value of input itself */
  value: valueShape,
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
}
