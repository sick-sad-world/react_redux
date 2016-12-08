import React from 'react';
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
    let id = `fun-${label}-${val}`;
    options.push(<input
                    type='radio'
                    id={id}
                    key={val}
                    defaultChecked={val === props.value}
                    onChange={props.onChange}
                    onFocus={setRootFocusClass}
                    onBlur={setRootFocusClass}
                    name={props.name}
                    value={val} />);
    options.push(<label htmlFor={id} key={label}>{label}</label>);
  });

  return (
    <div className={`toggler ${props.className}`}>
      {options}
      <em></em>
      <span></span>
    </div>
  );
}