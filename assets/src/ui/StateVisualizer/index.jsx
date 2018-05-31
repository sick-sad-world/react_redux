import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape, classNameShape } from 'shared/typings';
import EmptyImg from 'images/empty.svg';
import ErrorImg from 'images/error.svg';

export const stateVisualizerShape = {
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
export function StateVisualizer({title, text, additional, type, className, ...props}) {
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

StateVisualizer.defaultProps = {
  errorImage: ErrorImg,
  emptyImage: EmptyImg
}

StateVisualizer.propTypes = {
  /** ClassName that applied, to State Root component  */
  className: classNameShape,
  /** Image that should be displayed to indicate Error state */
  errorImage: PropTypes.string.isRequired,
  /** Image that should be displayed to indicate Empty state */
  emptyImage: PropTypes.string.isRequired,
  ...stateVisualizerShape
}