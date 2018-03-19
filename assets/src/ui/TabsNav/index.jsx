import bindAll from 'lodash/bindAll';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { classNameShape } from 'shared/typings';
import './styles.scss';

/** Tabs navigation component, ARIA enabled. Works with React Router or custom state management */
export default class TabsNav extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, 'renderLinks', 'renderNavLinks');
  }

  getTabWidth(length) {
    return Math.round(10000 / length) / 100
  }

  getTabStyles(length = 1) {
    const { linkProps } = this.props;
    return {
      flex: `0 0 ${this.getTabWidth(length)}%`,
      ...(linkProps.styles || {})
    }
  }

  renderNavLinks([path, element], i, {length}) {
    const { linkProps, activeClassName } = this.props;
    return (
      <NavLink key={i} {...linkProps} style={this.getTabStyles(length)} to={path} tabIndex={i === 0 ? 0 : -1} activeClassName={activeClassName}>{element}</NavLink>
    );
  }

  renderLinks([path, element], i, {length}) {
    const { linkProps, activeClassName, active, onChange } = this.props;
    return (
      <a
        {...linkProps}
        key={i}
        style={this.getTabStyles(length)}
        tabIndex={i === 0  ? 0 : -1}
        onClick={() => onChange(path)}
        className={classNames(linkProps.className, {[activeClassName]: active === path})}
      >
        {element}
      </a>
    );
  }

  render() {
    const {options, onChange, className, activeClassName, linkProps, active, ...props} = this.props;

    const method = isFunction(onChange) ? 'renderLinks' : 'renderNavLinks';

    const data = Object.entries(options);
    
    return (
      <nav className={classNames('Tabsnav--root', className)} {...props}>
        {data.map(this[method])}
      </nav>
    );
  }
}

TabsNav.defaultProps = {
  activeClassName: 'state--selected',
  linkProps: {}
}

TabsNav.propTypes = {
  /** Classname for root element */
  className: classNameShape,
  /** Classname added to matching link */
  activeClassName: PropTypes.string,
  /** Props merged into links */
  linkProps: PropTypes.object,
  /** Hash of items to render: [key] - router/statekey [value] - text/element to render */
  options: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element])).isRequired,
  /** Change handler applied to Links. Adding it forse rendering usual <a/> Links instead of ReactRouter ones */
  onChange: PropTypes.func,
  /** Current state key active. Required in conjunction with [onChange] property to indicate what tab should be shown*/
  active: PropTypes.string
}