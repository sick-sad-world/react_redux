import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNamesTyping } from 'shared/typings';
import styles from './styles.scss';

const TYPES = ['text', 'email', 'number', 'password'];
console.log(styles);
export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
    bindAll(this, 'onChange', 'onBlur', 'onFocus');
  }

  onChange({ target }) {
    const change = {[this.props.name]: target.value};
    const valid = (this.props.validate instanceof Function) ? this.props.validate(change) : true;
    this.props.onChange(change, valid);
  }

  onFocus(e) {
    e.persist();
    this.setState(() => ({ focus: true }));
    if (this.props.onFocus) this.props.onFocus(e.value);
  }

  onBlur(e) {
    e.persist();
    this.setState(() => ({ focus: false }));
    if (this.props.onBlur) this.props.onBlur(e.value);
  }

  render() {
    const {
      className,
      type,
      value,
      name,
      label,
      descr,
      prefix,
      suffix,
      valid,
      validate,
      pristine,
      onChange,
      onFocus,
      onBlur,
      ...props
    } = this.props;

    const invalid = Array.isArray(valid);

    const classes = {
      [styles['state--error']]: invalid && !pristine,
      [styles['state--focus']]: this.state.focus
    };

    return (
      <div className={classNames(styles['text-input'], classes, className)}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <div className={styles['input-body']}>
          <label>
            <span className={styles['label-text']}>{label}</span>
            <input {...props} name={name} type={type} value={value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur}name={name}/>
          </label>
          <hr/>
          {((invalid && !pristine) || descr) ? <span className={styles.subtext}>{(invalid && !pristine) ? valid.join(', ') : descr}</span> : null}
        </div>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    );
  }
}

TextInput.defaultProps = {
  type: 'text',
  value: '',
  label: '',
  pristine: true,
  valid: true
};

TextInput.propTypes = {
  /** HTML Class will be applied to container */
  className: classNamesTyping,
  /** Type property of an input */
  type: PropTypes.oneOf(TYPES),
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** Value of input itself */
  value: PropTypes.string.isRequired,
  /** Name property for input */
  name: PropTypes.string.isRequired,
  /** Function invoked on change event */
  onChange: PropTypes.func.isRequired,
  /** Function invoked when input gaining focus */
  onFocus: PropTypes.func,
  /** Function invoked when input losing focus */
  onBlur: PropTypes.func,
  /** Function to check whatever field is valid - should be provided by 3-rd party tool */
  validate: PropTypes.func,
  /** Define whatever field was touched */
  pristine: PropTypes.bool.isRequired,
  /** Field validation state mark it as valid [true] or invalid [Array[String]] */
  valid: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  /** Elements placed BEFORE field (icons, buttons) */
  prefix: PropTypes.element,
  /** Elements placed AFTER field (icons, buttons) */
  suffix: PropTypes.element
};
