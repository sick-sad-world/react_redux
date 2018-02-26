import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import icons from './data';

export default function Icon({ fill, g, viewBox, ...props }) {
  if (typeof icons[g] !== 'string') throw new Error(`Icon [${g}] not found in Icons list`);
  return <svg role='icon' viewBox={viewBox} {...props}><path fill={fill} d={icons[g]}></path></svg>;
}

Icon.defaultProps = {
  viewBox: '0 0 20 20'
};

Icon.propTypes = {
  fill: PropTypes.string,
  viewBox: PropTypes.string.isRequired,
  g: PropTypes.string.isRequired
};

export function IconButton({ fill, g, viewBox, ...props }) {
  return (
    <a {...props}>
      <Icon fill={fill} g={g} viewBox={viewBox} />
    </a>
  );
}

IconButton.propTypes = {
  fill: PropTypes.string,
  viewBox: PropTypes.string,
  g: PropTypes.string.isRequired
};

export function LinkButton({ fill, g, viewBox, ...props }) {
  return (
    <NavLink {...props}>
      <Icon fill={fill} g={g} viewBox={viewBox} />
    </NavLink>
  );
}

LinkButton.propTypes = {
  fill: PropTypes.string,
  viewBox: PropTypes.string,
  g: PropTypes.string.isRequired
};
