import PropTypes from 'prop-types';
import { emailStr, numBool, oneOfValues } from 'common/typecheck';

export const defaultTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export const defaultFrequency = [
  { value: 15, label: '15 min' },
  { value: 60, label: 'Hourly' },
  { value: 1440, label: 'Daily' },
  { value: 10080, label: 'Weekly' }
];

export const defaultData = {
  id: 0,
  name: '',
  columns: [],
  next_send: null,
  active: 1,
  frequency: 1440,
  recipient: '',
  order: null
};

export const defaultInterface = {
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.number).isRequired,
  next_send: PropTypes.string,
  active: numBool.isRequired,
  frequency: oneOfValues(defaultFrequency).isRequired,
  recipient: emailStr,
  order: PropTypes.number
};
