// Import utility stuff
// ===========================================================================
import { bindAll, pick, isEqual, without } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { stateNum } from '../typecheck';

function defaultMapDataToState(data) {
  return { ...data };
}

function defaultMapStateToData(state) {
  return { ...state };
}

export const injectedProps = {
  bindInput: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  makeUpdater: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  changed: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default function statefullForm(settings) {
  const opts = {
    mapDataToState: defaultMapDataToState,
    mapStateToData: defaultMapStateToData,
    propTypes: {},
    ...settings
  };

  function getStateValues({ data, ...rest }) {
    return opts.mapDataToState(data, rest);
  }

  return (Component) => {
    class StatefullForm extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          values: getStateValues(props),
          changed: []
        };
        bindAll(this, 'makeUpdater', 'bindInput', 'submit', 'checkChanges', 'reset');
      }

      componentWillReceiveProps(newProps) {
        if (newProps.state === 2) {
          this.reset(newProps);
        }
      }

      checkChanges(changed, value) {
        const change = without(changed, ...Object.keys(value));
        Object.entries(value).forEach(([k, v]) => {
          if (!isEqual(this.props.data[k], v)) {
            change.push(k);
          }
        });
        return change;
      }

      makeUpdater(entry, getter) {
        return (raw, ...args) => {
          this.setState(({ values, changed }, props) => {
            let value = (getter instanceof Function) ? getter(raw, values, props, ...args) : raw;
            if (!Array.isArray(entry)) {
              value = { [entry]: value };
            }
            return {
              values: { ...values, ...value },
              changed: this.checkChanges(changed, value)
            };
          });
        };
      }

      bindInput(entry, getter) {
        return {
          value: (Array.isArray(entry)) ? pick(this.state.values, entry) : this.state.values[entry],
          onChange: this.makeUpdater(entry, getter)
        };
      }

      submit() {
        return opts.mapStateToData(this.state.values, this.props, this.state.chaged);
      }

      reset(props = this.props) {
        this.setState({ values: getStateValues(props), changed: [] });
      }

      render() {
        const { data, ...rest } = this.props;
        return (
          <Component values={this.state.values} changed={this.state.changed} bindInput={this.bindInput} submit={this.submit} reset={this.reset} makeUpdater={this.makeUpdater} {...rest} />
        );
      }
    }

    StatefullForm.propTypes = {
      state: stateNum,
      data: PropTypes.object.isRequired,
      ...opts.propTypes
    };

    return StatefullForm;
  };
}
