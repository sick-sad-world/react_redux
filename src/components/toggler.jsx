import React from 'react';
import classNames from 'classnames';
import { forOwn } from 'lodash';

export default function Toggler (props) {
  let setRootFocusClass = (e) => {
    if (e.type === 'blur') {
      e.target.parentNode.classList.remove('is-focused')
    } else if (e.type === 'focus') {
      e.target.parentNode.classList.add('is-focused')
    }
  };

  let options = [];
  forOwn(props.options, (val, label) => {
    let id = `fun-${props.name}-${label}-${val}`;
    options.push(<input
                    disabled={props.disabled}
                    type='radio'
                    id={id}
                    key={props.name+'-'+val}
                    checked={val === props.value}
                    onChange={props.onChange}
                    onFocus={setRootFocusClass}
                    onBlur={setRootFocusClass}
                    name={props.name}
                    value={val} />);
    options.push(<label htmlFor={id} key={label}>{label}</label>);
  });

  let className = classNames({
    [props.className]: true,
    'toggler': true,
    'is-triple': options.length === 6,
    'is-disabled': props.disabled
  })

  return (
    <div className={className}>
      {options}
      <em></em>
      <span></span>
    </div>
  );
}