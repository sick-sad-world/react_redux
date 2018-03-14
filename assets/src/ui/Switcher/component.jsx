import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, errorShape, optionShape } from 'shared/typings';
import './styles.scss';

/** RadioButton input to choose some of many */
export default function Switcher({ className, value, name, label, descr, focus, error, onChange, onFocus, onBlur, options, ...props }) {
  const classes = {
    'state--error': !!error,
    'state--focus': focus
  };

  const id = `${name}-${value}`;

  const inputs = [];

  const labels = [];

  options.forEach((item, i) => {

    const key = `${name}-${i}`;
    const chk = item.value === value;
    const eId = (chk) ? id : null;

    inputs.push(<input key={key} title={label} id={eId} name={name} type='radio' value={i} checked={chk} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />);
    labels.push(<span key={key}>{item.label}</span>)
  });

  return (
    <div className={classNames('Switcher--root', classes, className)}>
      <div className='body'>
        {label && <label htmlFor={id}>{label}</label>}
        <div className='track'>
          {inputs}
          <span className='handle' />
        </div>
      </div>
      {descr && <span className='subtext'>{descr}</span>}
    </div>
  );
}

Switcher.defaultProps = {
  value: '',
  focus: false,
  error: false,
};

Switcher.propTypes = {
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** Options to choose from */
  options: optionShape('any').isRequired,
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
