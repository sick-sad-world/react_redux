import bindAll from 'lodash/bindAll';
import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';

function isValid(state) {
  const entries = Object.entries(state);
  return !entries.length ? false : !entries.filter(([k, v]) => Array.isArray(v)).length;
}

function updateValue(v) {
  return ({values}) => ({
    values: {
      ...values,
      ...v
    }
  })
}

function updateValid({ key, valid }) {
  return (state) => {
    const newState = { ...state.valid, [key]: valid };
    if (valid === undefined) {
      delete newState[key];
    }
    return { valid: newState };
  };
}

/** Form component, Provides general statefull form functionality common for all Forms */
export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: props.values || {},
      valid: {}
    }
    bindAll(this, 'bindInput', 'updateValue', 'setValues', 'updatePosition');
  }

  getChildContext() {
    return {
      updatePosition: this.updatePosition
    };
  }
 
  componentWillReceiveProps({values}) {
    this.setState(this.setValues(values));
  }
  
  setValues(values = {}) {
    return () => ({values});
  }
  
  updatePosition(data) {
    this.setState(updateValid(data), this.onValidation);
  }

  bindInput(name, getter = (value) => value) {
    return {
      value: this.state.values[name] || null,
      name,
      onChange: (e) => this.setState(updateValue(getter(e)))
    }
  }

  render() {
    const { children, onSubmit, values, ...props } = this.props;
    return (
      <form {...props} onSubmit={onSubmit}>
        {isFunction(children) && children({
          valid: isValid(this.state.valid),
          values: this.state.values,
          bindInput: this.bindInput
        })}
      </form>
    );
  }
}

Form.propTypes = {
  /** Values of form inner elements */
  values: PropTypes.object, // eslint-disable-line
  /** Function that should be assigned to Form as submit handler */
  onSubmit: PropTypes.func.isRequired,
  /** Children of an form, Uses Render as a Function pattern ({valid, values, bindInput}) */
  children: PropTypes.func.isRequired
}