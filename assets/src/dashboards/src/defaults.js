import PropTypes from 'prop-types';

export const defDashboard = {
  id: 0,
  name: '',
  url: '',
  order: null,
  column_ids: []
};

export const path = '/d';

export const width = 378;

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  order: PropTypes.number,
  column_ids: PropTypes.arrayOf(PropTypes.number).isRequired
};

