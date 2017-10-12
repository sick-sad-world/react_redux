import PropTypes from 'prop-types';
import { numBool } from 'common/typecheck';

export const defaultFrequency = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '60 min' }
];

export const defaultData = {
  id: 0,
  name: '',
  columns: [],
  active: 1,
  frequency: 15,
  recipient: null,
  order: -1,
  via_mail: true,
  via_twitter: null
};

export const coreInterface = {
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.number).isRequired,
  active: numBool.isRequired
};

export const defaultInterface = {
  ...coreInterface,
  frequency: PropTypes.oneOf(defaultFrequency.map(({ value }) => value)).isRequired,
  recipient: PropTypes.string,
  order: PropTypes.number.isRequired,
  via_mail: PropTypes.bool,
  via_twitter: PropTypes.bool
};
