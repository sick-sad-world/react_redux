import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { classNameShape } from 'shared/typings';
import Icon from '../Icon';
import './styles.scss';

/** Menu item can be shape or placeholder */
export const actionConfigShape = PropTypes.oneOfType([PropTypes.oneOf(['---']), PropTypes.shape({
  /** Label used as a text of a menu item */
  label: PropTypes.string.isRequired,
  /** Whatever Icon should be rendered or not */
  icon: PropTypes.string,
  /** Function handler bound to menu item */
  handler: PropTypes.func.isRequired
})]);

/** Simple link list as dropdown menu, representing different actions possible */
export default class ActionMenu extend React.Component {
  constructor(props) {
    super(props)
    bindAll(this, '_makeRootRef', 'runOnBodyClick');
  }

  componentWillMount() {
    if (this.props.onBodyClick instanceof Function) {
      document.body.addEventListener('click', this.runOnBodyClick)
    }
  }

  componentWillUnmount() {
    if (this.props.onBodyClick instanceof Function) {
      document.body.removeEventListener('click', this.runOnBodyClick)
    }
  }

  runOnBodyClick({target}) {
    if (!this.root.contains(target) && target.dataset.ignore !== this.props.dataIgnore) {
      this.props.onBodyClick();
    }
  }

  _makeRootRef(el) {
    this.root = el;
  }

  render() {
    const { data, className, rootClassName, onBodyClick, dataIgnore, ...props } = this.props;
    return (
      <nav {...props} ref={this._makeRootRef} className={classNames(rootClassName, className)}>
        {data.map((item, i) => {
          if (item === '---') {
            return <hr key={i} />
          }
          return (
            <a key={item.label} onClick={item.handler} title={item.label}>
              {item.icon && <Icon g={item.icon} />}
              {item.label}
            </a>
          )
        })}
      </nav>
    );
  }
}

ActionMenu.defaultProps = {
  rootClassName: 'ActionMenu--root',
}

ActionMenu.propTypes = {
  /** Optional onClick function that will be setup on <body> and fired only if event target is outside a component */
  onBodyClick: PropTypes.func,
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Do not run [onBodyClick] on DOM elemens which [data-ignore] attribute match this value */
  dataIgnore: PropTypes.string,
  /** ClassName applied to Root element */
  className: classNameShape,
  /** Data source for our action menu */
  data: PropTypes.arrayOf(actionConfigShape).isRequired
}
