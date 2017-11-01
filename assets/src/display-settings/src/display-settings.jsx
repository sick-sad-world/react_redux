import { includes, capitalize } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';
import DisplaySettings from './datasource';
import { dsValueShape } from './config';
import { updateArrayWithValue } from 'functions';
import Checkbox from 'common/components/forms/checkbox';
import Dropdown from 'common/components/forms/dropdown';

// Display options choosing
// ===========================================================================
export default function PickDisplaySettings({ data, value, onChange, predefined, disabled, title, className }) {
  function onChangeWrapper(val) {
    let v = null;
    if (val === 'custom') {
      v = DisplaySettings.getDefault();
    } else if (DisplaySettings.inPredefined(val)) {
      v = val;
    } else {
      v = updateArrayWithValue(value, val);
    }
    return onChange(v);
  }

  return (
    <fieldset className={className}>
      <legend>{title}</legend>
        <Dropdown
          disabled={disabled}
          className='row-flex'
          label='Display style'
          selectClassName='size-180'
          name='display_settings'
          value={(typeof value === 'string') ? value : 'custom'}
          onChange={onChangeWrapper}
          options={predefined}
        />
      <ul>
        {data.map((item) => {
          const disablence = (typeof valye === 'string' && value !== 'custom') || item.disabled || disabled || (item.name === 'wide_image' && !includes(value, 'image'));
          return (
            <li key={`opt_${item.name}`}>
              <Checkbox
                className={classNames('switcher-checkbox', { 'is-disabled': disablence })}
                name='display_settings'
                value={item.name}
                label={capitalize(item.name.replace('_', ' '))}
                disabled={disablence}
                checked={includes(value, item.name)}
                onChange={onChangeWrapper}
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
  predefined: DisplaySettings.getPredefined(),
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
  predefined: optionShape('string').isRequired,
  value: dsValueShape.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
