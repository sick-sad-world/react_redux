import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { classNameShape, errorShape } from 'shared/typings';

export default function TabsNav({className}) {
  
  return (
    <nav className={className} />
  );
}

TabsNav.propTypes = {
  className: classNameShape,

}