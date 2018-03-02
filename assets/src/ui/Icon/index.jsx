import React from 'react';
import PropTypes from 'prop-types';
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
