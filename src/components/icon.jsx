import React from 'react';
import { omit } from 'lodash';

export default function Icon (props) {
  return <svg { ...omit(props, 'icon') } viewBox='0 0 32 32'><use xlinkHref={`/img/icons.svg#${props.icon}`}></use></svg>;
}