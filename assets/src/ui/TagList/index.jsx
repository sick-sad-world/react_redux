import { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import IconButton from '../IconButton';

/** Tag List - interactive list of data that have small size */
export default function TagList({rootClassName, className, data, empty, error, onClose, onClick, ...props}) {

  let content = null;

  if (error) {
    content = <li className='state--error'>{error}</li>;
  } else if (!data.length) {
    content = <li className='state--empty'>{empty}</li>;
  } else if (data.length) {
    content = data.map((item) => (
      <li key={item.id} onClick={() => onClick(item)}>
        {item.prefix && (<div className='prefix'>{item.prefix}</div>)}
        <div className='content'>{item.value}</div>
        {onClose && <IconButton className='close' g='cross' onClick={(e) => e.stopPropagation() && onClose(item)} />}
      </li>
    ))
  }

  return (
    <ul {...props} className={classNames(rootClassName, className)}>
      {content}
    </ul>
  );
}

TagList.defaultProps = {
  rootClassName: 'TagList--root',
  data: [],
  empty: 'No items found'
}

TagList.propTypes = {
  /** Data Source of a Component */
  data: PropTypes.arrayOf(PropTypes.shape({
    /** ID of an record, used as [key] */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** String|Elemnt|Array(Element)  Content  */
    content: childrenShape.isRequired,
    /** String|Elemnt|Array(Element) Prefix will be rendered before content, Image/Badge/Icon or something custom */
    prefix: childrenShape
  })).isRequired,
  /** String|Elemnt|Array(Element) Message used when component have no data */
  empty: childrenShape.isRequired,
  /** String|Elemnt|Array(Element) Error message, will be rendered INSTEAD of data, if provided */
  error: childrenShape.isRequired,
  /** ClassNames added to element */
  className: classNameShape,
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Click handler for close button -> Function(Object(item)). Button won't be rendered without it  */
  onClose: PropTypes.func,
  /** Click handler for each List item -> Function(Object(item))  */
  onClick: PropTypes.func
}