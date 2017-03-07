import React from 'react';
import classNames from 'classnames';
import { forOwn } from 'lodash';

export default function Toggler ({name, label, disabled, value, onChange, options, className, togglerClassName}) {
  let setRootFocusClass = (e) => {
    if (e.type === 'blur') {
      e.target.parentNode.classList.remove('is-focused')
    } else if (e.type === 'focus') {
      e.target.parentNode.classList.add('is-focused')
    }
  };

  let opts = [];
  forOwn(options, (val, label) => {
    let id = `fun-${name}-${label}-${val}`;
    opts.push(<input
                    disabled={disabled}
                    type='radio'
                    id={id}
                    key={name+'-'+val}
                    checked={val === value}
                    onChange={onChange}
                    onFocus={setRootFocusClass}
                    onBlur={setRootFocusClass}
                    name={name}
                    value={val} />);
    opts.push(<label htmlFor={id} key={label}>{label}</label>);
  });

  return (
    <div className={className}>
      <span className='form-label'>{label}:</span>
      <div className={classNames({
        [togglerClassName]: true,
        'toggler': true,
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