import React from 'react';
import Datetime from 'react-datetime';
import TextInput from '../TextInput';
import './styles.scss';

export default function Datepicker(props) {
  return (
    <Datetime
      {...props}
      renderInput={(inputProps, openCalendar, closeCalendar) => <TextInput {...inputProps} onFocus={openCalendar} />}
    />
  )
}

