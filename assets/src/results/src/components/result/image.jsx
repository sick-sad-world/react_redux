import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Result Media block
// ===========================================================================
export default function ResultMedia({ image, title, style, wide, onLoad, onError }) {
  return (
    <figure className={classNames('result-image', { 'is-wide': wide })} onLoad={onLoad} onError={onError} style={{ ...style, backgroundImage: `url(${image})` }}>
      <img src={image} alt={title}/>
    </figure>
  );
}

ResultMedia.propTypes = {
  image: PropTypes.string,
  wide: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.string)
};
