import bindAll from 'lodash/bindAll';
import every from 'lodash/every';
import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { validShape, classNameShape, valueShape } from 'shared/typings';
import ruleBase from './rules';

function makeid(name, length = 5) {
  let text = `${name}-`;
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function getValueDefault({ target }, {name}) {
  return { [name]: target.value }
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

function combineValidator(raw) {
  const rules = (Array.isArray(raw)) ? raw : [raw];
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

function validate(ruleSet, val, opts) {
  let result = true;
  if (val instanceof FileList) {
    result = Array.prototype.map.call(val, v => ruleSet(v, opts));
    result = every(result, v => v === true) || result;
  } else {
    result = ruleSet(val, opts);
  }
  return result;
}

export default function makeFormField(getValue = getValueDefault) {
  return (Component) => {
    class FormField extends React.Component {
      constructor(props) {
        super(props);
        this.eid = makeid(props.name);
        this.ruleSet = combineValidator(props.rules);
        this.state = {
          pristine: props.pristine,
          valid: true
        }
        bindAll(this, 'onChange', 'validate');
      }

      componentWillMount() {
        const valid = validate(this.props.value);
        callContextAction(this.context.updatePosition, {
          key: this.eid,
          valid
        });
        this.setState(() => ({ valid }));
      }

      componentWillReceiveProps({rules}) {
        this.ruleSet = combineValidator(rules);
      }
  
      onChange(e) {
        const change = getValue(e, this.props);
        const valid = isFunction(this.props.validate) ? this.props.validate(change) : true;
        this.props.onChange(change, valid);
      }

      validate(val, opts) {
        const valid = validate(this.ruleSet, val, opts);
        callContextAction(this.context.updatePosition, {
          key: this.eid,
          valid
        });
        this.setState(() => ({
          valid,
          pristine: false
        }));
        return valid;
      }
  
      render() {
        const {
          pristine,
          valid,
          disabled,
          validate,
          onChange,
          className,
          value,
          ...props
        } = this.props;
  
        const error = (isFunction(validate) && Array.isArray(valid) && pristine === false) ? valid.join(', ') : false;

        const classes = {
          'state--error': error,
          'state--disabled': disabled
        }
  
        return (
          <Component
            {...props}
            value={value}
            error={error}
            disabled={disabled}
            validate={this.validate}
            valid={this.state.valid}
            pristine={this.state.pristine}
            className={classNames(classes, className)}
            onChange={this.onChange}
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
      /** Function to check whatever field is valid - should be provided by 3-rd party tool */
      validate: PropTypes.func,
      /** Define whatever field was touched */
      pristine: PropTypes.bool,
      /** Field validation state mark it as valid [true] or invalid [Array[String]] */
      valid: validShape,
      /** Value of input field */
      value: valueShape,
      /** Rules for validation */
      rules: PropTypes.array
    }

    FormField.contextTypes = {
      updatePosition: PropTypes.func
    }
  
    return FormField;
  }
}
