import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import { classNameShape } from 'shared/typings';

/** IconButton component description */
export default function IconButton({ className, fill, g, viewBox, ...props }) {
  return (
    <a className={classNames('icon-button', className)} {...props}>
      <Icon fill={fill} g={g} viewBox={viewBox} />
    </a>
  );
}

IconButton.propTypes = {
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** HEX value for path fill property */
  fill: PropTypes.string,
  /** Viewbox value for SVG element - controls "viewport" of SVG */
  viewBox: PropTypes.string,
  /** Icon name to pick path data from storage */
  g: PropTypes.string.isRequired
}
