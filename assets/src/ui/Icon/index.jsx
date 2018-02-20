import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import icons from './data';

export default function Icon({ fill, icon, viewBox, ...props }) {
  if (typeof icons[icon] !== 'string') throw new Error(`Icon [${icon}] not found in Icons list`);
  return <svg role='icon' viewBox={viewBox} {...props}><path fill={fill} d={icons[icon]}></path></svg>;
}

Icon.defaultProps = {
  viewBox: '0 0 20 20'
};

Icon.propTypes = {
  fill: PropTypes.string,
  viewBox: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export function IconButton({ fill, icon, viewBox, ...props }) {
  return (
    <a {...props}>
      <Icon fill={fill} icon={icon} viewBox={viewBox} />
    </a>
  );
}

IconButton.propTypes = {
  fill: PropTypes.string,
  viewBox: PropTypes.string,
  icon: PropTypes.string.isRequired
};

export function LinkButton({ fill, icon, viewBox, ...props }) {
  return (
    <NavLink {...props}>
      <Icon fill={fill} icon={icon} viewBox={viewBox} />
    </NavLink>
  );
}

LinkButton.propTypes = {
  fill: PropTypes.string,
  viewBox: PropTypes.string,
  icon: PropTypes.string.isRequired
};
