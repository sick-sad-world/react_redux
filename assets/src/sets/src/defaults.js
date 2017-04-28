import PropTypes from 'prop-types';
import { } from 'common/typecheck';

export const defaultData = {
  id: 0,
  order: null,
  name: '',
  source_ids: []
};

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  order: PropTypes.number,
  name: PropTypes.string.isRequired,
  source_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  counter: PropTypes.number
};
