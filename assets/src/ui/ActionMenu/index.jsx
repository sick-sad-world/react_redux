import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape } from 'shared/typings';
import Icon from '../Icon';
import './styles.scss';

export const actionConfigShape = PropTypes.oneOfType([PropTypes.oneOf(['---']), PropTypes.shape({
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  handler: PropTypes.func.isRequired
})]);

/** Simple link list as dropdown menu, representing different actions possible */
export default function ActionMenu({data, className, rootClassName }) {
  return (
    <nav className={classNames(rootClassName, className)}>
      {data.map((item, i) => {
        if (item === '---') {
          return <hr key={i} />
        }
        return (
          <a key={i} onClick={item.handler}>
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
  className: classNameShape,
  data: PropTypes.arrayOf(actionConfigShape).isRequired
}
