import PropTypes from 'prop-types';
import { oneOfArray } from 'common/typecheck';

export const feedTypes = ['Facebook', 'HTML', 'RSS', 'Twitter', 'Reddit'];

export const defaultData = {

};

export const defaultInterface = {
  id: PropTypes.number.isRequired,
  feedurl: PropTypes.string.isRequired,
  frequency: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: oneOfArray(feedTypes).isRequired,
  nextupdate: PropTypes.string,
  lastfound: PropTypes.string
};
