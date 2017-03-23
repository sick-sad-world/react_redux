import React from 'react';
import icons from '../helpers/icons';

export default function Icon ({fill, icon, ...props}) {
  return <svg viewBox='0 0 20 20' {...props}><path fill={fill} d={icons[icon]}></path></svg>;
}