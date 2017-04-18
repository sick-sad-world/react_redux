import PropTypes from 'prop-types';
import { email, numBool } from 'common/typecheck';

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
  fullname: PropTypes.string,
  position: PropTypes.string,
  status: PropTypes.string,
  image: PropTypes.string,
  is_admin: numBool,
  email,
  email_bcc: PropTypes.arrayOf(email)
};
