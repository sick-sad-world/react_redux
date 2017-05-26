import React from 'react';
import PropTypes from 'prop-types';

// Result Media block
// ===========================================================================
export default function ResultMedia({ image, title, style }) {
  return (
    <figure className='result-image' style={{ ...style, backgroundImage: `url(${image})` }}>
      <img src={image} alt={title}/>
    </figure>
  );
}

ResultMedia.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.string)
};
