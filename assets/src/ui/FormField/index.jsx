import bindAll from 'lodash/bindAll';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { validShape, classNameShape } from 'shared/typings';

function setFocus() {
  return { focus: true }
}

function unsetFocus() {
  return { focus: false }
}

function getValueDefault({ target }, {name}) {
  return { [name]: target.value }
}

export default function makeFormField(getValue = getValueDefault) {
  return (Component) => {
    class FormField extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          focus: false
        }
        bindAll(this, 'onChange', 'onBlur', 'onFocus');
      }
  
      onChange(e) {
        const change = getValue(e, this.props);
        const valid = isFunction(this.props.validate) ? this.props.validate(change) : true;
        this.props.onChange(change, valid);
      }
  
      onFocus(e) {
        e.persist();
        this.setState(setFocus, () => !!this.props.onFocus && this.props.onFocus(e));
      }
  
      onBlur(e) {
        e.persist();
        this.setState(unsetFocus, () => !!this.props.onBlur && this.props.onBlur(e));
      }
  
      render() {
        const {
          pristine,
          valid,
          disabled,
          validate,
          onChange,
          onFocus,
          onBlur,
          className,
          ...props
        } = this.props;
  
        const error = (isFunction(validate) && Array.isArray(valid) && pristine === false) ? valid.join(', ') : false;

        const classes = {
          'state--error': error,
          'state--focus': this.state.focus,
          'state--disabled': disabled
        }
  
        return (
          <Component
            {...props}
            error={error}
            disabled={disabled}
            className={classNames(classes, className)}
            focus={this.state.focus}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        );
      }
    }
  
    FormField.propTypes = {
      /** HTML Class will be applied to container */
      className: classNameShape,
      /** Name property for input */
      name: PropTypes.string.isRequired,
      /** Whatever TextField is disabled */
      disabled: PropTypes.bool,
      /** Function invoked on change event */
      onChange: PropTypes.func.isRequired,
      /** Function invoked when input gaining focus */
      onFocus: PropTypes.func,
      /** Function invoked when input losing focus */
      onBlur: PropTypes.func,
      /** Function to check whatever field is valid - should be provided by 3-rd party tool */
      validate: PropTypes.func,
      /** Define whatever field was touched */
      pristine: PropTypes.bool,
      /** Field validation state mark it as valid [true] or invalid [Array[String]] */
      valid: validShape
    }
  
    return FormField;
  }
}
