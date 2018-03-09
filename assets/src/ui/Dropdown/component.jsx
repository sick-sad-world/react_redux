import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { classNameShape, errorShape } from '../../shared/typings';
import 'node_modules/react-select/dist/react-select.css';
import styles from './styles.scss';

export default function Dropdown({...props}) {
  return (
    <Select {...props} />
  )
}

Dropdown.defaultProps = {

};

Dropdown.propTypes = {

};