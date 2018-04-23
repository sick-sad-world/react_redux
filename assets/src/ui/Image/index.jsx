import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';

export function makePlaceholder(str) {
  return str.split(' ').reduce((acc, str) => {
    acc += str[0];
  }, '')
}

export default class Image extends React.Component {
  onError() {
    if (isFunction(this.props.onError)) {
      this.props.onError(this.props.src);
    }
  }
  render() {
    const { src, placeholder, alt, ...props} = this.prosp;
    return (
      <img {...props} src={src} data-pladeholder={placeholder || makePlaceholder(alt)} alt={alt} onError={this.onError} />
    )
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onError: PropTypes.func
}