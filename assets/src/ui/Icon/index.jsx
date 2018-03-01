import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import icons from './data';

/** Icon component description */
export default function Icon({ fill, g, viewBox, ...props }) {
  if (typeof icons[g] !== 'string') throw new Error(`Icon [${g}] not found in Icons list`);
  return <svg role='icon' viewBox={viewBox} {...props}><path fill={fill} d={icons[g]}></path></svg>;
}

Icon.defaultProps = {
  viewBox: '0 0 20 20'
};

Icon.propTypes = {
  /** HEX value for path fill property */
  fill: PropTypes.string,
  /** Viewbox value for SVG element - controls "viewport" of SVG */
  viewBox: PropTypes.string.isRequired,
  /** Icon name to pick path data from storage */
  g: PropTypes.string.isRequired
};

/** IconButton component description */
export function IconButton({ fill, g, viewBox, ...props }) {
  return (
    <a {...props}>
      <Icon fill={fill} g={g} viewBox={viewBox} />
    </a>
  );
}

IconButton.propTypes = {
  /** HEX value for path fill property */
  fill: PropTypes.string,
  /** Viewbox value for SVG element - controls "viewport" of SVG */
  viewBox: PropTypes.string,
  /** Icon name to pick path data from storage */
  g: PropTypes.string.isRequired
};

/** IconLink component description */
export function IconLink({ fill, g, viewBox, ...props }) {
  return (
    <NavLink {...props}>
      <Icon fill={fill} g={g} viewBox={viewBox} />
    </NavLink>
  );
}

IconLink.propTypes = {
  /** HEX value for path fill property */
  fill: PropTypes.string,
  /** Viewbox value for SVG element - controls "viewport" of SVG */
  viewBox: PropTypes.string,
  /** Icon name to pick path data from storage */
  g: PropTypes.string.isRequired
};
