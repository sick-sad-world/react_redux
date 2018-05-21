import bindAll from 'lodash/bindAll';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Form as Validable } from 'react-validable';

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {}
    }
    bindAll(this, 'bindInput', 'updateValue');
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
      onChange: (e) => this.setState(updateValue(getter(e)))
    }
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
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
  onSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired
}

export default Form(Validable);