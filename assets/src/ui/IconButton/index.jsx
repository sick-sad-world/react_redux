import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

/** IconButton component description */
export default function IconButton({ fill, g, viewBox, ...props }) {
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
