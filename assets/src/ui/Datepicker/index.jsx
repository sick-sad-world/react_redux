import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import TextInput from '../TextInput';
import './styles.scss';

/** DateTime wrapper providing required intarface and Proper TextInput field as target */
export default function Datepicker({onChange, format, ...props}) {
  function handleChange(value) {
    return (value instanceof moment) ? value.format(format) : value;
  }

  const formats = format ? format.split(' ') : null;

  return (
    <Datetime
      {...props}
      dateFormat={formats ? formats[0] : undefined}
      timeFormat={formats ? formats[1] : undefined}
      onChange={handleChange}
      renderInput={(inputProps, openCalendar) => <TextInput {...inputProps} onFocus={openCalendar} />}
    />
  )
}

Datepicker.propTypes = {
  /** String Format of output value */
  format: PropTypes.string,
  /** Value of an Input may be date string or Moment/Date instance */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
  /** Function for handling change events */
  onChange: PropTypes.func.isRequired
};
