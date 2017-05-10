import PropTypes from 'prop-types';

export const defDashboard = {
  id: 0,
  name: '',
  column_ids: []
};

export const path = '/d';

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  column_ids: PropTypes.arrayOf(PropTypes.number).isRequired
};

