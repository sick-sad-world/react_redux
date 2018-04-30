import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape, classNameShape } from 'shared/typings';
import Badge from '../Badge';
import Image from '../Image';
import EmptyImg from 'images/empty.svg';
import ErrorImg from 'images/error.svg';

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
 */
function StatusRenderer(data) {
  return <Badge className={classNames(statusValues[data][0], 'status')} value={statusValues[data][1]} />
}

/**
 * Render array as comma separated list
 */
function ListRenderer(data, {def}) {
  return (
    <ul className='small-list'>
      {data.length ? data.map(({label, id}) => (<li key={id}>{label}</li>)) : <li className='state--empty'>{def}</li>}
    </ul>
  );
}

function ImageRenderer(data, cfg) {
  return <Image rounded={cfg.rounded} width={cfg.size} height={cfg.size} src={data.src} alt={data.alt || cfg.def} />
}

/**
 * Plain renderer of value with default fallback
 */
function RenderDefault(data, {def = 'not found'}) {
  return (
    <span>{(data === null || data === undefined || data === '') ? def : data }</span>
  )
}

export default {
  image: ImageRenderer,
  status: StatusRenderer,
  list: ListRenderer,
  renderDefault: RenderDefault
}