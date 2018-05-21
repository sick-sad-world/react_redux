import React from 'react';
import bindAll from 'lodash/bindAll';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { childrenShape, classNameShape, validShape } from 'shared/typings';
import './styles.scss';
import Icon from '../Icon';

export default class Fieldset extend React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: (props.collapsable) ? props.open : false
    }
    bindAll(this, 'toggleOpen');
  }

  toggleOpen() {
    this.setState(({open}) => ({
      open: !open
    }))
  }

  render() {
    const { title, collapsable, children, className, rootClassName, error, open, ...props } = this.props;
    const rootClasses = classNames(rootClassName, className, {
      'state--error': !!error,
      'is-collapsable': collapsable,
      'state--open': collapsable && this.state.open
    });
  
    return (
      <fieldset {...props} className={rootClasses}>
        <legend onClick={(collapsable) ? this.toggleOpen : null}>
          <div>
            <span>
              {error && <Icon g='error' viewBox='0 0 24 24' />}
              {title}
            </span>
            {collapsable && <Icon g={(this.state.open) ? 'chevron-up' : 'chevron-down'} />}
          </div>
        </legend>
        <div className='content'>
          <div className='content-body'>
            {children}
          </div>
          {error && (
            <div className='error-message'>
              {(Array.isArray(error) ? error.join(', ') : error)}
            </div>
          )}
        </div>
      </fieldset>
    );
  }

}

Fieldset.defaultProps = {
  rootClassName: 'Fieldset--root',
  collapsable: false,
  open: false,
  error: false
}

Fieldset.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Contents of fieldset */
  children: childrenShape,
  /** Class names added to root component */
  className: classNameShape,
  /** Define whatever fieldset should be able to collapse in accordion style */
  collapsable: PropTypes.bool.isRequired,
  /** Title of fieldset - rendered as <legend/> */
  title: PropTypes.string.isRequired,
  /** Forse fieldset to be open from outside */
  open: PropTypes.bool.isRequired,
  /** Error message to display, accepts default error format */
  error: validShape.isRequired
}