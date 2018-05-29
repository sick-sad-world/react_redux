import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import { childrenShape } from 'shared/typings';
import TextInput from '../TextInput';
import './styles.scss';

/** DateTime wrapper providing required intarface and Proper TextInput field as target */
export default function Datepicker({onChange, format, InputComponent, name, ...props}) {

  const formats = format ? format.split(' ') : null;

  return (
    <Datetime
      {...props}
      dateFormat={formats ? formats[0] : undefined}
      timeFormat={formats ? formats[1] : undefined}
      onChange={(value) => onChange({
        [name]: (format) ? value.format(format) : value
      })}
      renderInput={(input, openCalendar) => <InputComponent {...input} name={name} onFocus={openCalendar} />}
    />
  )
}

Datepicker.defaultProps = {
  InputComponent: TextInput
}

Datepicker.propTypes = {
  /** Name property for input */
  name: PropTypes.string.isRequired,
  /** Component to render Input */
  InputComponent: childrenShape.isRequired,
  /** String Format of output value */
  format: PropTypes.string,
  /** Value of an Input may be date string or Moment/Date instance */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
  /** Function for handling change events */
  onChange: PropTypes.func.isRequired
}
