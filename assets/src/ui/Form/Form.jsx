import bindAll from 'lodash/bindAll';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';

/** Form component, Provides general statefull form functionality common for all Forms */
export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: props.values || {}
    }
    bindAll(this, 'bindInput', 'updateValue', 'setValues');
  }

  
  componentWillReceiveProps({values}) {
    this.setState(this.setValues(values));
  }
  
  setValues(values = {}) {
    return () => ({values});
  }

  updateValue(v) {
    return ({values}) => ({
      values: {
        ...values,
        ...v
      }
    })
  }

  bindInput(name, getter = (value) => value) {
    return {
      value: this.state.values[name] || null,
      onChange: (e) => this.setState(this.updateValue(getter(e)))
    }
  }

  render() {
    const { children, onSubmit, values, ...props } = this.props;
    return (
      <form {...props} onSubmit={onSubmit}>
        {isFunction(children) && children({
          valid: this.props.valid,
          values: this.state.values,
          bindInput: this.bindInput
        })}
      </form>
    );
  }
}

Form.defaultProps = {
  valid: true
}

Form.propTypes = {
  /** Values of form inner elements */
  values: PropTypes.object, // eslint-disable-line
  /** Function that should be assigned to Form as submit handler */
  onSubmit: PropTypes.func.isRequired,
  /** Define if form is valid in general, this value provided by react-validable */
  valid: PropTypes.bool.isRequired,
  /** Children of an form, Uses Render as a Function pattern ({valid, values, bindInput}) */
  children: PropTypes.func.isRequired
}