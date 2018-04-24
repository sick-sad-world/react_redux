import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import IconButton from '../IconButton';

export default function TagList({rootClassName, className, data, emptyText, onClose, onClick, ...props}) {
  return (
    <ul {...props} className={classNames(rootClassName, className)}>
      {(data.length) ? data.map((item) => {
        return (
          <li key={item.id} onClick={() => onClick(item)}>
            {item.prefix && (<div className='prefix'>{item.prefix}</div>)}
            <div className='content'>{item.value}</div>
            {onClose && <IconButton className='close' g='cross' onClick={(e) => e.stopPropagation() && onClose(item)} />}
          </li>
        )
      }) : <span className='state--empty'>{emptyText}</span>}
    </ul>
  );
}

TagList.defaultProps = {
  rootClassName: 'TagList--root',
  data: [],
  emptyText: 'No items found'
}

TagList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: childrenShape.isRequired,
    prefix: childrenShape
  })).isRequired,
  emptyText: PropTypes.string.isRequired,
  className: classNameShape,
  rootClassName: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onClick: PropTypes.func
}