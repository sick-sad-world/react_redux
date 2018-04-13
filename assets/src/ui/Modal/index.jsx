import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {createPortal} from 'react-dom';

export default class ModalWindow extends React.Component {
  constructor(props) {
    super(props)
    this.root = document.getElementById('modal-root');
    this.el = document.createElement('div');
  }
  componentDidMount() {
    this.root.appendChild(this.el);
  }

  componentWillUnmount() {
    this.root.removeChild(this.el);
  }

  render() {
    const { className, children, ...props } = this.props;
    const Modal = (
      <section {...props} className={classNames('Modal-root', className)}>
        {children}
      </section>
    );
    return createPortal(Modal, this.el);
  }
}