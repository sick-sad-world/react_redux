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

/** Provide proper exports for child components */
export const ModalHeader = Header; 
export const ModalFooter = Footer; 

/** Modal Component for UI Framework */
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
    const { key, className, children, onOverlayClick, target, style, open, rootClassName, ...props } = this.props;
    const delay = (open) ? defaultDuration : 0;
    return (
      <section key={key} {...props} style={{...style, ...anim, transitionDelay: `${delay}ms` }} className={classNames(rootClassName, className)}>
        {children}
      </section>
    );
  }

  render() {
    const { key, open } = this.props;
    return createPortal((
      <div>
        <Animation key={`overlay-${key}`} in={open} type='fade' unmountOnExit mountOnEnter>{this.renderOverlay}</Animation>,
        <Animation key={`modal-${key}`} in={open} type='fadeDown' unmountOnExit mountOnEnter>{this.renderModal}</Animation>
      </div>
    ), this.target);
  }
}

ModalWindow.defaultProps = {
  open: false,
  rootClassName: 'Modal--root',
  target: 'modal-root',
  key: 'modal'
}

ModalWindow.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Unique key identifier of modal applied both to <Overlay> and <Modal/> with apropriate prefixes */
  key: PropTypes.string.isRequired,
  /** Classes applied to root component */
  className: classNameShape,
  /** Modal Contents */
  children: childrenShape,
  /** ID to look for DOM Element that portal will bound to */
  target: PropTypes.string.isRequired,
  /** Function bound to [click] on <Overlay/> */
  onOverlayClick: PropTypes.func,
  /** Boolean indicates whatever modal is open or closed */
  open: PropTypes.bool.isRequired,
  /** Styles directly applied to Modal <section/> that should be merged with animation styles */
  style: PropTypes.object // eslint-disable-line
}