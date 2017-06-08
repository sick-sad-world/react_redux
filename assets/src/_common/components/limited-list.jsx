import React from 'react';
import PropTypes from 'prop-types';

export function LimitedListItem({ id, name }) {
  return <li key={id}><span className='t-ellipsis'>{name}</span></li>;
}

LimitedListItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

// Small limited list
// ===========================================================================
export default function LimitedList({ title, className, limit, payload, children, emptyText, moreText }) {
  return (
    <ul className={className}>
      {(title) ? <li className='title'><h4>{title}</h4></li> : null}
      {(payload.length) ? payload.slice(0, limit).map(children) : <li className='state-empty'>{emptyText}</li>}
      {(payload.length > limit) ? <li className='state-more'>{moreText.replace('%d', payload.length - limit)}</li> : null}
    </ul>
  );
}

LimitedList.defaultProps = {
  limit: 3,
  payload: [],
  children: LimitedListItem,
  emptyText: 'This list is empty',
  moreText: 'And %d items',
  className: null,
  title: null
};

LimitedList.propTypes = {
  limit: PropTypes.number.isRequired,
  payload: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  emptyText: PropTypes.string.isRequired,
  moreText: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string
};
