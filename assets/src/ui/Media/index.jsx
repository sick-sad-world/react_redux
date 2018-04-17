import bindAll from 'lodash/bindAll';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import ImgLoading from 'images/image-loading.svg';
import ImgError from 'images/image-error.svg';
import './styles.scss';


export default class Media extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      state: false
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
    const {src, alt, isBroken, loadingImage, errorImage, ...props} = this.props;
    
    if (this.state.state === 'loading') {
      return <figure {...props} className='Media--root' dangerouslySetInnerHTML={{__html: loadingImage}} />
    } else if (this.state.state === 'error' || isBroken) {
      return <figure {...props} className='Media--root' dangerouslySetInnerHTML={{__html: errorImage}} />
    }
    console.log(this.state.state);
    return (
      <figure {...props} className='Media--root' >
        <img alt={alt} src={src} onLoad={this.onLoad} onError={this.onError} />
      </figure>
    )
  }
}

Media.defaultProps = {
  isBroken: false,
  loadingImage: ImgLoading,
  errorImage: ImgError
}

Media.propTypes = {
  sendCorruptedUrl: PropTypes.func,
  isBroken: PropTypes.bool.isRequired,
  alt: PropTypes.string.isRequired,
  loadingImage: PropTypes.string.isRequired,
  errorImage: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
}