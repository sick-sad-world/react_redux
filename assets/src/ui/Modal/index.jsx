import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { classNameShape, childrenShape } from 'shared/typings';
import Header from './header';
import Footer from './footer';
import './styles.scss';

export const ModalHeader = Header; 
export const ModalFooter = Footer; 

export default class ModalWindow extends React.Component {
  constructor(props) {
    super(props)
    this.target = document.getElementById(props.target);
    this.el = document.createElement('div');
    this.el.setAttribute('id', props.key);
    this.el.classList.add('container');
  }
  componentDidMount() {
    this.target.appendChild(this.el);
  }

  componentWillUnmount() {
    this.target.removeChild(this.el);
  }

  render() {
    const { key, className, children, onOverlayClick, target, ...props } = this.props;
    const Modal = [
      <span key={`overlay-${key}`} className='overlay' onClick={onOverlayClick} />,
      <section key={key} {...props} className={classNames('Modal--root', className)}>
        {children}
      </section>
    ];
    return createPortal(Modal, this.el);
  }
}

ModalWindow.defaultProps = {
  target: 'modal-root',
  key: 'modal'
}

ModalWindow.propTypes = {
  key: PropTypes.string.isRequired,
  className: classNameShape,
  children: childrenShape,
  target: PropTypes.string.isRequired,
  onOverlayClick: PropTypes.func,
}