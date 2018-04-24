import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import IconButton from '../IconButton';

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
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: childrenShape.isRequired,
    prefix: childrenShape
  })).isRequired,
  empty: childrenShape.isRequired,
  error: childrenShape.isRequired,
  className: classNameShape,
  rootClassName: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onClick: PropTypes.func
}