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
    if (isFunction(this.props.onError)) {
      this.props.onError(this.props.src);
    }
    this.setState(() => ({state: 'error'}))
  }

  render() {
    const {src, alt, isBroken, children, className, style, rootClassName, onError, ...props} = this.props;

    const isError = this.state.state === 'error' || isBroken;

    return (
      <figure {...props} className={classNames(rootClassName, className)} style={{...style, backgroundImage: (!isError) ? `url(${src})` : null}}>
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
  rootClassName: 'Media--root',
  isBroken: false
}

Media.propTypes = {
  /** Classname all styles bound to */
  className: classNameShape,
  /** String|Elemnt|Array(Element) Contents of <figcaption/> */
  children: childrenShape,
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Additional styles for root element added ontop of internal one */
  style: PropTypes.object, // eslint-disable-line
  /** Function called when image loading ends with error 404 or so.. */
  onError: PropTypes.func,
  /** Forse this Media content broken */
  isBroken: PropTypes.bool.isRequired,
  /** Alternative text for image */
  alt: PropTypes.string.isRequired,
  /** URL source of an image */
  src: PropTypes.string.isRequired
}