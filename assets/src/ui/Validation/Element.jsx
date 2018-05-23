import { bindAll, omit, every } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ruleBase from './rules';

function makeid(name, length = 5) {
  let text = `${name}-`;
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function makeValidator(validator, defOpts) {
  return (val, opts) => validator(val, { ...defOpts, ...opts });
}

function createRuleset(rules) {
  return rules.map((rule) => {
    const isSimple = typeof rule === 'string';
    const alias = (isSimple) ? rule : rule.rule;
    if (typeof ruleBase[alias] !== 'function') {
      throw Error(`Validator [${alias}] not found in set of Possible validation rules. Check spelling or add it using [addRules] helper function`);
    }
    return makeValidator(ruleBase[alias], (isSimple) ? {} : omit(rule, 'rule'));
  });
}

function combineValidator(rules) {
  const ruleSet = createRuleset(rules);
  return (val, opts = []) => {
    const result = ruleSet.map((validator, i) => validator(val, opts[i] || {})).filter(res => typeof res === 'string');
    return (result.length > 0) ? result : true;
  };
}

function callContextAction(func, ...args) {
  if (typeof func === 'function') {
    func(...args);
  }
}

export default function makeValidableElement(rules) {
  const ruleSet = combineValidator((Array.isArray(rules)) ? rules : [rules]);
  let eid = '';

  function validate(val, opts) {
    let result = true;
    if (val instanceof FileList) {
      result = Array.prototype.map.call(val, v => ruleSet(v, opts));
      result = every(result, v => v === true) || result;
    } else {
      result = ruleSet(val, opts);
    }
    return result;
  }

  return (Component) => {
    class Validable extends React.Component {
      constructor(props) {
        super(props);
        eid = makeid(props.name);
        this.state = {
          pristine: this.props.pristine,
          valid: true
        };
        bindAll(this, 'validate');
      }

      componentWillMount() {
        const valid = validate(this.props.value);
        callContextAction(this.context.updatePosition, {
          key: eid,
          valid
        });
        this.setState({ valid });
      }

      componentWillReceiveProps({ pristine }) {
        if (!pristine && pristine !== this.state.pristine) {
          this.setState({ pristine });
        }
      }

      validate(val, opts) {
        const valid = validate(val, opts);
        callContextAction(this.context.updatePosition, {
          key: eid,
          valid
        });
        this.setState({
          valid,
          pristine: false
        });
        return valid;
      }

      render() {
        const { name, pristine, ...props } = this.props;
        return (
          <Component
            {...props}
            name={name}
            valid={this.state.valid}
            pristine={this.state.pristine}
            validate={this.validate}
          />
        );
      }

      componentWillUnmount() {
        callContextAction(this.context.updatePosition, {
          key: eid,
          valid: undefined
        });
      }
    }

    Validable.defaultProps = {
      pristine: true
    };

    Validable.propTypes = {
      pristine: PropTypes.bool,
      name: PropTypes.string,
      value: PropTypes.any
    };

    Validable.contextTypes = {
      updatePosition: PropTypes.func
    };

    return Validable;
  };
}
