import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { NavLink } from 'react-router-dom';
import { classNameShape } from 'shared/typings';
import './styles.scss';

const THEMES = ['accent', 'action'];

/** Tabs navigation component, ARIA enabled. Works with React Router or custom state management */
export default class TabsNav extends React.Component {

  getTabWidth(length) {
    return Math.round(10000 / length) / 100
  }

  getTabStyles(width) {
    const { linkProps } = this.props;
    return {
      flex: `0 0 ${width}%`,
      ...(linkProps.styles || {})
    }
  }

  getPaceStyles(index, width) {
    return {
      left: `${width * index}%`,
      width: `${width}%`
    }
  }

  // renderNavLinks([path, element], i, {length}) {
  //   const { linkProps, activeClassName } = this.props;
  //   return (
  //     <NavLink
  //       {...linkProps}
  //       key={i}
  //       style={this.getTabStyles(length)}
  //       to={path}
  //       tabIndex={i === 0 ? 0 : -1}
  //       activeClassName={activeClassName}
  //     >
  //       {element}
  //     </NavLink>
  //   );
  // }

  render() {
    const {options, onChange, className, activeClassName, linkProps, active, rootClassName, theme, ...props} = this.props;

    // const method = isFunction(onChange) ? 'renderLinks' : 'renderNavLinks';

    const data = Object.entries(options);
    
    const width = this.getTabWidth(data.length);

    let activeIndex = 0; 

    return (
      <nav className={cn(rootClassName, className, `style--${theme}`)} {...props}>
        {data.map(([path, element], i) => {
          let isCurrent = active === path;
          if (isCurrent) {
            activeIndex = i;
          }
          return (
            <a {...linkProps} key={path} style={this.getTabStyles(width)} tabIndex={i === 0  ? 0 : -1} onClick={() => onChange(path)}>
              {element}
            </a>
          )
        })}
        <span className='pace' key='pace' style={this.getPaceStyles(activeIndex, width)} />
      </nav>
    );
  }
}

TabsNav.defaultProps = {
  rootClassName: 'Tabsnav--root',
  activeClassName: 'state--selected',
  theme: 'accent',
  linkProps: {}
}

TabsNav.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
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
  active: PropTypes.string,
  /** Themming of tabs nav */
  theme: PropTypes.oneOf(THEMES).isRequired
}