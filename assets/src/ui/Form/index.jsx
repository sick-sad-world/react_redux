import bindAll from 'lodash/bindAll';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Form as Validable } from 'react-validable';

class Form extends Component {
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
    return (values) => ({
      values: {
        ...values,
        [name]: v
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
    const { children, onSubmit } = this.props;
    return (
      <form onSubmit={onSubmit}>
        {children({
          valid: this.props.valid,
          values: this.state.values,
          bindInput: this.bindInput
        })}
      </form>
    );
  }
}

Form.propTypes = {
  values: PropTypes.object, // eslint-disable-line
  onSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired
}

export default Form(Validable);