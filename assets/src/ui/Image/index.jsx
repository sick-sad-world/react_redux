import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import { classNameShape } from 'shared/typings';
import './styles.scss';

export function makePlaceholder(str, limit = 2) {
  return str.split(' ').reduce((acc, sub) => {
    if (acc.length <= limit) {
      acc += sub[0];
    }
    return acc;
  }, '');
}

export default class Image extends React.Component {
  constructor(props) {
    super(props)
    bindAll(this, 'onError');
  }
  
  onError() {
    if (isFunction(this.props.onError)) {
      this.props.onError(this.props.src);
    }
  }

  render() {
    const { src, placeholder, alt, rootClassName, className, rounded, ...props} = this.props;
    return (
      <img
        {...props}
        className={classNames(rootClassName, className, {'style--rounded': rounded})}
        src={src}
        data-placeholder={placeholder || makePlaceholder(alt)}
        alt={alt}
        onError={this.onError}
      />
    )
  }
}

Image.defaultProps = {
  rounded: false,
  rootClassName: 'Image--root'
}

Image.propTypes = {
  rounded: PropTypes.bool.isRequired,
  rootClassName: PropTypes.string.isRequired,
  className: classNameShape,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onError: PropTypes.func
}