import React from 'react';

export default function Icon (props) {
  return <svg { ...props } viewBox='0 0 32 32'><use xlinkHref={`/img/icons.svg#${props.icon}`}></use></svg>;
}