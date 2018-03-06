import bindAll from 'lodash/bindAll';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import { validShape } from '../../shared/typings';

function setFocus() {
  return { focus: true };
}

function unsetFocus() {
  return { focus: false };
}

export default function makeFormField(Component) {
  class FormField extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        focus: false
      };
      bindAll(this, 'onChange', 'onBlur', 'onFocus');
    }

    onChange({ target }) {
      const change = { [this.props.name]: target.value };
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
        validate,
        onChange,
        onFocus,
        onBlur,
        ...props
      } = this.props;

      const error = (isFunction(validate) && Array.isArray(valid) && pristine === false) ? valid.join(', ') : false;

      return <Component {...props} error={error} focus={this.state.focus} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} />;
    }
  }

  FormField.propTypes = {
    /** Value of input itself */
    value: PropTypes.string.isRequired,
    /** Name property for input */
    name: PropTypes.string.isRequired,
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
  };

  return FormField;
}
