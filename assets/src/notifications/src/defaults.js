import PropTypes from 'prop-types';

export const duration = 8000;

export const limit = 4;

export const defaultData = {
  id: null,
  type: 'info',
  text: null,
  visible: false
};

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['error', 'info', 'loading', 'warning', 'success']).isRequired,
  text: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
};
