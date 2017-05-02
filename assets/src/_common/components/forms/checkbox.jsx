// Import React related stuff
// ===========================================================================
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../icon';

// Checkbox Component
// ===========================================================================
export default function Checkbox({ name, disabled, value, checked, onChange, title, label, className }) {
  return (
    <label className={className}>
      <span className={classNames('switcher-checkbox', { 'is-disabled': disabled })}>
        <input
          type='checkbox'
          name={name}
          title={title}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <Icon icon='check' />
      </span> {label || value}
    </label>
  );
}

Checkbox.defaultProps = {
  label: null,
  value: '',
  cheked: false,
  onChange: null,
  disabled: false
};

Checkbox.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string
};
