import { bindAll } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

function isValid(state) {
  const entries = Object.entries(state);
  return !entries.length ? false : !entries.filter(([k, v]) => Array.isArray(v)).length;
}

function updateState({ key, valid }) {
  return (state) => {
    const newState = { ...state.valid, [key]: valid };
    if (valid === undefined) {
      delete newState[key];
    }
    return { valid: newState };
  };
}

export const Form = function makeValidableForm(Component) {
  class ValidableForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        valid: {}
      };
      bindAll(this, 'updatePosition');
    }

    getChildContext() {
      return {
        updatePosition: this.updatePosition
      };
    }

    updatePosition(data) {
      this.setState(updateState(data), this.onValidation);
    }

    onValidation() {
      return (this.props.onValidation) && this.props.onValidation(isValid(this.state.valid), this.state.valid);
    }

    render() {
      const { onValidation, exposeRaw, ...props } = this.props;
      return (
        <Component
          {...props}
          validationState={(exposeRaw) ? this.state.valid : undefined}
          valid={isValid(this.state.valid)}
        />
      );
    }
  }

  ValidableForm.propTypes = {
    exposeRaw: PropTypes.bool,
    onValidation: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
  };

  ValidableForm.childContextTypes = {
    updatePosition: PropTypes.func
  };

  return ValidableForm;
};
