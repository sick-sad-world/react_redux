import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { classNameShape, childrenShape } from 'shared/typings';
import Animation, { defaultDuration } from '../Animations';
import Header from './header';
import Footer from './footer';
import './styles.scss';

export const ModalHeader = Header; 
export const ModalFooter = Footer; 

export default class ModalWindow extends React.Component {
  constructor(props) {
    super(props)
    bindAll(this, 'renderOverlay', 'renderModal');
  }
  componentWillMount() {
    this.target = document.getElementById(this.props.target);
  }

  renderOverlay(style) {
    const { onOverlayClick, open } = this.props;
    const delay = (!open) ? defaultDuration : 0;
    return <span style={{...style, transitionDelay: `${delay}ms` }} className='overlay' onClick={onOverlayClick} />;
  }

  renderModal(anim) {
    const { key, className, children, onOverlayClick, target, style, open, ...props } = this.props;
    const delay = (open) ? defaultDuration : 0;
    return (
      <section key={key} {...props} style={{...style, ...anim, transitionDelay: `${delay}ms` }} className={classNames('Modal--root', className)}>
        {children}
      </section>
    );
  }

  render() {
    const { key, open } = this.props;
    return createPortal([
      <Animation key={`overlay-${key}`} in={open} type='fade' unmountOnExit mountOnEnter>{this.renderOverlay}</Animation>,
      <Animation key={`modal-${key}`} in={open} type='fadeDown' unmountOnExit mountOnEnter>{this.renderModal}</Animation>
    ], this.target);
  }
}

ModalWindow.defaultProps = {
  open: false,
  target: 'modal-root',
  key: 'modal'
}

ModalWindow.propTypes = {
  key: PropTypes.string.isRequired,
  className: classNameShape,
  children: childrenShape,
  target: PropTypes.string.isRequired,
  onOverlayClick: PropTypes.func,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object
}