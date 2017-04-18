import PropTypes from 'prop-types';
import { email, id } from 'common/typecheck';

export const defaultData = {
  state: 1,
  payload: {
    id: 0,
    email: '',
    email_bcc: [],
    name: '',
    fullname: '',
    position: '',
    status: '',
    is_admin: 0,
    image: '/img/ph_user.png'
  }
};

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  fullname: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  email_bcc: PropTypes.arrayOf(PropTypes.string).isRequired
};
