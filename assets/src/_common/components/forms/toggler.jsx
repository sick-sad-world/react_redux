import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forOwn } from 'lodash';

export default function Toggler({ name, label, disabled, value, onChange, options, className, togglerClassName }) {
  function setRootFocusClass(e) {
    if (e.type === 'blur') {
      e.target.parentNode.classList.remove('is-focused');
    } else if (e.type === 'focus') {
      e.target.parentNode.classList.add('is-focused');
    }
  }

  const opts = [];
  forOwn(options, (val, key) => {
    const id = `fun-${name}-${key}-${val}`;
    opts.push(<input
                    disabled={disabled}
                    type='radio'
                    id={id}
                    key={`${name}-${val}`}
                    checked={val === value}
                    onChange={onChange}
                    onFocus={setRootFocusClass}
                    onBlur={setRootFocusClass}
                    name={name}
                    value={val} />);
    opts.push(<label htmlFor={id} key={key}>{key}</label>);
  });

  return (
    <div className={className}>
      <span className='form-label'>{label}:</span>
      <div className={classNames({
        [togglerClassName]: true,
        toggler: true,
        'is-triple': opts.length === 6,
        'is-disabled': disabled
      })}>
        {opts}
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
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  className: PropTypes.string,
  togglerClassName: PropTypes.string
};
