import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Icon from '../Icon';

/** IconLink component description */
export default function IconLink({ fill, g, viewBox, ...props }) {
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
}
