import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

export default class ActionMenu extends React.Component {
  render() {
    const {data, open, rootClassName, activeClassName, reverseClassName } = this.props;

    const rootClass = classNames({
      [rootClassName]: true,
      [activeClassName]: open,
      [reverseClassName]: false
    });

    return (
      <nav role='menu' className={rootClass}>
        {data.map((item, i) => {
          if (item === '---') {
            return <hr key={`${item}${i}`} />
          }
          return (
            <a key={item.label} role='menuitem' tabIndex={(i == 0) ? 0 : -1} onClick={item.handler}>
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
  activeClassName: 'state--open',
  reverseClassName: 'state-reverse',
  open: false
}

ActionMenu.propTypes = {
  rootClassName: PropTypes.string.isRequired,
  activeClassName: PropTypes.string.isRequired,
  reverseClassName: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['---']), PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    handler: PropTypes.func.isRequired
  })])).isRequired
}
