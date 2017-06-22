import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { includes, capitalize } from 'lodash';
import DisplaySettings from './datasource';
import Checkbox from 'common/components/forms/checkbox';

// Display options choosing
// ===========================================================================
export default function PickDisplaySettings({ data, value, onChange, disabled, title, className }) {
  return (
    <fieldset className={className}>
      <legend>{title}</legend>
      <ul>
        {data.map((item) => {
          const disablence = item.disabled || disabled || (item.name === 'wide_image' && !includes(value, 'image'));
          return (
            <li key={`opt_${item.name}`}>
              <Checkbox
                className={classNames('switcher-checkbox', { 'is-disabled': disablence })}
                name='display_settings'
                value={item.name}
                label={capitalize(item.name.replace('_', ' '))}
                disabled={disablence}
                checked={includes(value, item.name)}
                onChange={onChange}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

PickDisplaySettings.defaultProps = {
  title: 'Select what to display for each item',
  disabled: false,
  data: DisplaySettings.getRenderMap(),
  value: DisplaySettings.getDefault()
};

PickDisplaySettings.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  })).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
