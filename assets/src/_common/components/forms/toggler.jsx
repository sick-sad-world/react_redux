import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { normalizeValue } from 'functions';
import { optionShape } from 'common/typecheck';

export default function Toggler({ name, label, disabled, value, onChange, options, className, togglerClassName }) {
  function setRootFocusClass(e) {
    if (e.type === 'blur') {
      e.target.parentNode.classList.remove('is-focused');
    } else if (e.type === 'focus') {
      e.target.parentNode.classList.add('is-focused');
    }
  }

  return (
    <div className={className}>
      <span className='form-label'>{label}:</span>
      <div className={classNames({
        [togglerClassName]: true,
        toggler: true,
        'is-triple': options.length === 3,
        'is-disabled': disabled
      })}>
        {options.reduce((acc, option) => {
          const id = `fun-${name}-${option.label}-${option.value}`;
          acc.push(<input
                    disabled={disabled}
                    type='radio'
                    id={id}
                    key={`${name}-${option.value}`}
                    checked={option.value === value}
                    onChange={e => onChange(normalizeValue(e.target.value))}
                    onFocus={setRootFocusClass}
                    onBlur={setRootFocusClass}
                    name={name}
                    value={option.value}
                  />);
          acc.push(<label htmlFor={id} key={option.label}>{option.label}</label>);
          return acc;
        }, [])}
        <em></em>
        <span></span>
      </div>
    </div>
  );
}

Toggler.defaultProps = {
  disabled: false
};

Toggler.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: optionShape('any').isRequired,
  className: PropTypes.string,
  togglerClassName: PropTypes.string
};
