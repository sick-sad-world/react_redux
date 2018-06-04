import React from 'react';
// import PropTypes from 'prop-types';
import cn from 'classnames';
import Badge from '../Badge';
import Image from '../Image';

const statusValues = {
  1: ['success', 'Active'],
  0: ['error', 'Inactive']
}

/**
 * Render Status via special badge i.e [Active|Inactive] e.t.c
 * @param {*} data 
 */
function StatusRenderer(data, cfg) {
  return <Badge style={{width: cfg.size}} className={cn(statusValues[data][0])} value={statusValues[data][1]} />
}

/**
 * Render Feed type, RSS, HTML, Facebook, e.t.c.
 * @param {*} data 
 */
function FeedTypeRenderer(data, cfg) {
  return <Badge style={{width: cfg.size}} className={cn(data)} value={data} />
}

/**
 * Render array as comma separated list
 * @param {*} data 
 * @param {*} param1 
 */
function ListRenderer(data, {def}) {
  return (
    <ul className='small-list'>
      {data.length ? data.map(({label, id}) => (<li key={id}>{label}</li>)) : <li className='state--empty'>{def}</li>}
    </ul>
  );
}

/**
 * Render Image - User avatar or something else
 * @param {*} data 
 * @param {*} cfg 
 */
function ImageRenderer(data, cfg) {
  return <div className='image-content'><Image rounded={cfg.rounded} style={{ width: cfg.size, height: cfg.size}} src={data.src} alt={data.alt || cfg.def} /></div>
}

/**
 * Plain renderer of value with default fallback
 */
function RenderDefault(data, {className = '', def = 'not found'}) {
  return (
    <span className={className}>{(data === null || data === undefined || data === '') ? def : data }</span>
  )
}

export default {
  image: ImageRenderer,
  status: StatusRenderer,
  list: ListRenderer,
  feedType: FeedTypeRenderer,
  renderDefault: RenderDefault
}