import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import './styles';

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
    this.setState(() => ({state: 'error'}))
  }

  render() {
    const {src, alt, ...props} = this.props;

    const url = (this.state.state) ? this.props[`${this.state}Placeholder`] : src;

    return (
      <img {...props} alt={alt} src={url} onLoad={this.onLoad} onError={this.onError} />
    )
  }
}

Media.defaultProps = {
  isBroken: false,
  loadingPlaceholder: '',
  errorPlaceholder: ''
}

Media.propTypes = {
  isBroken: PropTypes.bool.isRequired,
  alt: PropTypes.string.isRequired,
  loadingPlaceholder: PropTypes.string.isRequired,
  errorPlaceholder: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
}