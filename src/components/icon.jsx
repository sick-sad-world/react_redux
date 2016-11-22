import React from 'react';

export default function Icon (props) {
  return <svg className={props.className} title={props.title} viewBox='0 0 32 32'><use xlinkHref={'img/icons.svg#' + props.icon}></use></svg>;
}