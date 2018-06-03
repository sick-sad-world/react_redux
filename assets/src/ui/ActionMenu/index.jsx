import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { classNameShape, idShape } from 'shared/typings';
import Icon from '../Icon';
import './styles.scss';

/** Menu item can be shape or placeholder */
export const actionShape = PropTypes.shape({
  /** Used as key for list */
  id: idShape.isRequired,
  /** Label used as a text of a menu item */
  label: PropTypes.string,
  /** Whatever Icon should be rendered or not */
  icon: PropTypes.string,
  /** Function handler bound to menu item */
  handler: PropTypes.func
});

/** Simple link list as dropdown menu, representing different actions possible */
export default class ActionMenu extends React.Component {
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
        {data.map(({label, handler, icon, key}) => {
          if (!label && !handler) {
            return <hr key={key} />
          }
          return (
            <a key={key} onClick={handler} title={label}>
              {icon && <Icon g={icon} />}
              {label}
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
  data: PropTypes.arrayOf(actionShape).isRequired
}
