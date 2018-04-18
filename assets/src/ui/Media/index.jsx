import bindAll from 'lodash/bindAll';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';


export default class Media extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      state: 'loading'
    }
    bindAll(this, 'onLoad', 'onError');
  }

  componentWillReceiveProps({src, isBroken }) {
    if (src !== this.props.src) {
      this.setState(() => ({loading: (isBroken) ? 'error' : 'loading'}))
    }
  }

  onLoad() {
    this.setState(() => ({state: false}))
  }

  onError() {
    if (isFunction(this.props.sendCorruptedUrl)) {
      this.props.sendCorruptedUrl(this.props.src);
    }
    this.setState(() => ({state: 'error'}))
  }

  render() {
    const {src, alt, isBroken, children, className, style, ...props} = this.props;

    const isError = this.state.state === 'error' || isBroken;

    return (
      <figure {...props} className={classNames('Media--root', className)} style={{...style, backgroundImage: (!isError) ? `url(${src})` : null}}>
        {(isError)  && (
          <span className='error-message'>
            <span>Image Not<br />Found</span>
          </span>
        )}
        <img alt={alt} src={src} onLoad={this.onLoad} onError={this.onError} />
        {children && <figcaption>{children}</figcaption>}
      </figure>
    )
  }
}

Media.defaultProps = {
  isBroken: false
}

Media.propTypes = {
  className: classNameShape,
  children: childrenShape,
  style: PropTypes.object,
  sendCorruptedUrl: PropTypes.func,
  isBroken: PropTypes.bool.isRequired,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
}