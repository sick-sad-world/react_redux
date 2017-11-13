import PropTypes from 'prop-types';
import { numBool } from 'common/typecheck';
// import UserImg from 'img/ph_user.png';

export const defaultData = {
  id: 0,
  email: 'some@gmail.com',
  email_bcc: [],
  name: '',
  fullname: '',
  position: '',
  status: '',
  is_admin: 0,
  image: '/img/ph_user.png'
};

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  fullname: PropTypes.string,
  position: PropTypes.string,
  status: PropTypes.string,
  image: PropTypes.string.isRequired,
  is_admin: numBool.isRequired,
  email: PropTypes.string.isRequired,
  email_bcc: PropTypes.arrayOf(PropTypes.string)
};
