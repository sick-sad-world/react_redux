import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape, classNameShape } from 'shared/typings';
import Badge from '../Badge';
import Icon from '../Icon';

const statusValues = {
  1: ['success', 'Active'],
  0: ['error', 'Inactive']
}

export const listStateRendererShape = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  additional: childrenShape
}

/**
 * Render list state Empty or Error ones. This will be rendered INSTEAD of list
 */
export function ListStateRenderer({title, text, additional, className}) {
  return (
    <div className={classNames('', className)}>
      <Icon g='images' />
      <div className='content'>
        <h4>{title}</h4>
        {text && <span>{text}</span>}
        {additional}
      </div>
    </div>
  );
}

ListStateRenderer.propTypes = {
  className: classNameShape,
  ...listStateRendererShape
};

/**
 * Render Status via special badge i.e [Active|Inactive] e.t.c
 */
function StatusRenderer(data) {
  return <Badge className={classNames(statusValues[data][0], 'status')}>{statusValues[data][1]}</Badge>
}

/**
 * Render array as comma separated list
 */
function ListRenderer(data, def) {
  return (
    <ul className='small-list'>
      {data.length ? data.map(({label, id}) => (<li key={id}>{label}</li>)) : <li className='state--empty'>{def}</li>}
    </ul>
  );
}

/**
 * Plain renderer of value with default fallback
 */
function RenderDefault(data, def = 'not found') {
  return (
    <span>{(data === null || data === undefined || data === '') ? def : data }</span>
  )
}

export default {
  status: StatusRenderer,
  list: ListRenderer,
  renderDefault: RenderDefault
}