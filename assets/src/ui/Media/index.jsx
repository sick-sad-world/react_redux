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
    const {src, alt, isBroken, children, className, ...props} = this.props;

    return (
      <figure {...props} className={classNames('Media--root', className)} >
        {(this.state.state === 'error' || isBroken)  && (<span className='error-message'>Image Not Found</span>)}
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
  sendCorruptedUrl: PropTypes.func,
  isBroken: PropTypes.bool.isRequired,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
}