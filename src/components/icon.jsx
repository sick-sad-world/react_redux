import React from 'react';
import icons from '../helpers/icons';
import { omit } from 'lodash';

export default function Icon (props) {
  return <svg viewBox='0 0 20 20' {...omit(props, ['fill', 'icon'])}><path fill={props.fill} d={icons[props.icon]}></path></svg>;
}