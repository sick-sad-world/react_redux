import React from 'react';
import PropTypes from 'prop-types';
import icons from '../icons';

export default function Icon({ fill, icon, ...props }) {
  return <svg viewBox='0 0 20 20' {...props}><path fill={fill} d={icons[icon]}></path></svg>;
}
Icon.propTypes = {
  fill: PropTypes.string,
  icon: PropTypes.string.isRequired
};
