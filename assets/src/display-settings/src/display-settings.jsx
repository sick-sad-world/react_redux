import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { includes, transform } from 'lodash';
import DisplaySettings from './datasource';
import Checkbox from 'common/components/forms/checkbox';

// Display options choosing
// ===========================================================================
export default function PickDisplaySettings({ data, value, onChange, disabled, title, className }) {
  return (
    <fieldset className={className}>
      <legend>{title}</legend>
      <ul>
        {transform(data, (acc, v, k) => {
          const disablence = v.disabled || disabled || (k === 'wide_image' && !includes(value, 'image'));
          acc.push(
            <li key={`opt_${k}`}>
              <Checkbox
                className={classNames('switcher-checkbox', { 'is-disabled': disablence })}
                name='display_settings'
                value={k}
                disabled={disablence}
                checked={includes(value, k)}
                onChange={onChange}
              />
            </li>
          );
          return acc;
        }, [])}
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
  data: PropTypes.object.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
