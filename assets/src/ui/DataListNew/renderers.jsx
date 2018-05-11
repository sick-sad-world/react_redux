import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape, classNameShape } from 'shared/typings';
import EmptyImg from 'images/empty.svg';
import ErrorImg from 'images/error.svg';
import Badge from '../Badge';
import Image from '../Image';

const statusValues = {
  1: ['success', 'Active'],
  0: ['error', 'Inactive']
}

export const listStateRendererShape = {
  /** Title of state screen */
  title: PropTypes.string.isRequired,
  /** Text description of state */
  text: PropTypes.string,
  /** Additional markup for state */
  additional: childrenShape
}

/**
 * Render list state Empty or Error ones. This will be rendered INSTEAD of list
 */
export function ListStateRenderer({title, text, additional, type, className, ...props}) {
  return (
    <div className={classNames('state--message', className)}>
      <div dangerouslySetInnerHTML={{__html: props[`${type}Image`]}} />
      <div className='content'>
        <h4>{title}</h4>
        {text && <span>{text}</span>}
        {additional}
      </div>
    </div>
  );
}

ListStateRenderer.defaultProps = {
  errorImage: ErrorImg,
  emptyImage: EmptyImg
}

ListStateRenderer.propTypes = {
  /** ClassName that applied, to State Root component  */
  className: classNameShape,
  /** Image that should be displayed to indicate Error state */
  errorImage: PropTypes.string.isRequired,
  /** Image that should be displayed to indicate Empty state */
  emptyImage: PropTypes.string.isRequired,
  ...listStateRendererShape
}

/**
 * Render Status via special badge i.e [Active|Inactive] e.t.c
 * @param {*} data 
 */
function StatusRenderer(data, cfg) {
  return <Badge style={{width: cfg.size}} className={classNames(statusValues[data][0])} value={statusValues[data][1]} />
}

/**
 * Render Feed type, RSS, HTML, Facebook, e.t.c.
 * @param {*} data 
 */
function FeedTypeRenderer(data, cfg) {
  return <Badge style={{width: cfg.size}} className={classNames(data)} value={data} />
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