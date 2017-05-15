import PropTypes from 'prop-types';
import { emailStr, numBool, imageUrl } from 'common/typecheck';
import UserImg from 'img/ph_user.png';

export const defaultData = {
  state: 1,
  payload: {
    id: 0,
    email: 'some@gmail.com',
    email_bcc: [],
    name: '',
    fullname: '',
    position: '',
    status: '',
    is_admin: 0,
    image: UserImg
  }
};

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  fullname: PropTypes.string,
  position: PropTypes.string,
  status: PropTypes.string,
  image: imageUrl.isRequired,
  is_admin: numBool.isRequired,
  email: emailStr.isRequired,
  email_bcc: PropTypes.arrayOf(emailStr)
};
