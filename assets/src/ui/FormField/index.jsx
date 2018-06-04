import bindAll from 'lodash/bindAll';
import every from 'lodash/every';
import omit from 'lodash/omit';
import cn from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { classNameShape, valueShape } from 'shared/typings';
import { makeid, callContextAction } from 'shared/utils';
import ruleBase from './rules';

function getValueDefault({ target }, {name}) {
  return { [name]: target.value }
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

function combineValidator(raw) {
  if (!raw) return false;
  const rules = (Array.isArray(raw)) ? raw : [raw];
  const ruleSet = createRuleset(rules);
  return (val, opts = []) => {
    const result = ruleSet.map((validator, i) => validator(val, opts[i] || {})).filter(res => typeof res === 'string');
    return (result.length > 0) ? result : true;
  };
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
        if (this.ruleSet) {
          const valid = validate(this.ruleSet, this.props.value);
          callContextAction(this.context.updatePosition, {
            key: this.eid,
            valid
          });
          this.setState(() => ({ valid }));
        }
      }

      componentWillReceiveProps({rules, pristine}) {
        this.ruleSet = combineValidator(rules);
        if (!pristine && this.state.pristine) {
          this.setState(() => ({pristine}))
        } 
      }

      componentWillUnmount() {
        callContextAction(this.context.updatePosition, {
          key: this.eid,
          valid: undefined
        });
      }
  
      onChange(e) {
        const change = getValue(e, this.props);
        this.props.onChange(change, this.ruleSet ? this.validate(change[this.props.name]) : true);
      }

      validate(val, opts) {
        const valid = validate(this.ruleSet, val, opts);
        
        this.setState(() => ({
          valid,
          pristine: false
        }), () => callContextAction(this.context.updatePosition, {
          key: this.eid,
          valid
        }));
        return !Array.isArray(valid);
      }
  
      render() {
        const {
          pristine,
          disabled,
          onChange,
          className,
          value,
          ...props
        } = this.props;
  
        const error = (this.ruleSet && Array.isArray(this.state.valid) && this.state.pristine === false) ? this.state.valid.join(', ') : false;

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
            className={cn(classes, className)}
            onChange={this.onChange}
          />
        );
      }
    }

    FormField.defaultProps = {
      pristine: true
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
      /** Define whatever field was touched */
      pristine: PropTypes.bool,
      /** Value of input field */
      value: valueShape,
      /** Rules for validation */
      rules: PropTypes.arrayOf([PropTypes.string, PropTypes.shape({
        rule: PropTypes.string.isRequired
      })])
    }

    FormField.contextTypes = {
      updatePosition: PropTypes.func
    }
  
    return FormField;
  }
}
