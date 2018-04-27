import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
export default function ActionMenu({ data, className, rootClassName, ...props }) {
  return (
    <nav {...props} className={classNames(rootClassName, className)}>
      {data.map((item) => {
        if (item === '---') {
          return <hr key={item.label} />
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

ActionMenu.defaultProps = {
  rootClassName: 'ActionMenu--root',
}

ActionMenu.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** ClassName applied to Root element */
  className: classNameShape,
  /** Data source for our action menu */
  data: PropTypes.arrayOf(actionConfigShape).isRequired
}
