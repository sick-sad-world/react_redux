// Import utility stuff
// ===========================================================================
import { bindAll, pick, isEqual, without } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

function defaultMapDataToState(data) {
  return { ...data };
}

function defaultMapStateToData(state) {
  return { ...state };
}

function defaultComparator(v, k, data) {
  return isEqual(data[k], v);
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
    comparator: defaultComparator,
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
        if (!newProps.loading) {
          this.reset(newProps);
        }
      }

      checkChanges(changed, value) {
        const change = without(changed, ...Object.keys(value));
        Object.entries(value).forEach(([k, v]) => {
          if (!opts.comparator(v, k, this.props.data)) {
            change.push(k);
          }
        });
        return change;
      }

      makeUpdater(entry, getter) {
        return (raw, ...args) => {
          this.setState(({ values, changed }, props) => {
            let value = (getter instanceof Function) ? getter(raw, values, props, ...args) : raw;
            if (value === undefined) {
              return {};
            }
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
        return this.props.onSubmit(opts.mapStateToData(this.state.values), null, this.state.changed);
      }

      reset(props) {
        this.setState({
          values: getStateValues((typeof props.data === 'object') ? props : this.props),
          changed: []
        });
      }

      render() {
        const { data, ...rest } = this.props;
        const { values, changed } = this.state;
        return (
          <Component
            values={values}
            changed={changed}
            bindInput={this.bindInput}
            submit={this.submit}
            reset={this.reset}
            makeUpdater={this.makeUpdater}
            {...rest}
          />
        );
      }
    }

    StatefullForm.propTypes = {
      data: PropTypes.object.isRequired,
      onSubmit: PropTypes.func.isRequired,
      ...opts.propTypes
    };

    return StatefullForm;
  };
}
