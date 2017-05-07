import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { includes } from 'lodash';
import { displayOptions, defaultDisplay } from '../defaults';
import Checkbox from 'common/components/forms/checkbox';

// Display options choosing
// ===========================================================================
export default function DisplayOptions({ data, value, onChange, disabled, title, className }) {
  const displaySettings = [];
  let displaySettingsRow = [];
  data.forEach((setting, i) => {
    const disablence = disabled || (setting === 'wide_image' && !includes(value, 'image'));
    displaySettingsRow.push((
      <td key={`cell${i}`}>
        <Checkbox
          className={classNames('switcher-checkbox', { 'is-disabled': disablence })}
          name='display_settings'
          value={setting}
          disabled={disablence}
          checked={includes(value, setting)}
          onChange={onChange}
        />
      </td>
    ));
    if (i % 3 === 2 && (i + 1) !== data.length) {
      displaySettings.push(<tr key={`row${i}`}>{displaySettingsRow}</tr>);
      displaySettingsRow = [];
    }
  });

  return (
    <fieldset className={className}>
      <legend>{title}</legend>
      <table className='is-slim'>
        <tbody>{displaySettings}</tbody>
      </table>
    </fieldset>
  );
}

DisplayOptions.defaultProps = {
  title: 'Select what to display for each item',
  disabled: false,
  data: [...displayOptions],
  value: [...defaultDisplay]
};

DisplayOptions.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
