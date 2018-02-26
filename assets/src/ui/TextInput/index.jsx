import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNamesTyping } from 'shared/typings';
import styles from './styles.scss';

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
    bindAll(this, 'onChange', 'onBlur', 'onFocus');
  }

  onChange({ target }) {
    this.props.onChange(target.value, this.props.validate(target.value));
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
    const { className, type, value, name, label, prefix, suffix, valid, validate, pristine, descr, onChange, onFocus, onBlur, ...props } = this.props;

    const invalid = Array.isArray(valid);

    const classes = {
      [styles['state--error']]: invalid && !pristine,
      [styles['state--focus']]: this.state.focus
    };

    return (
      <div className={classNames(styles['text-input'], classes, className)}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <div className={styles['input-body']}>
          <input {...props} type={type} id={name} value={value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur}name={name}/>
          <label htmlFor={name}>{label}</label>
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
  className: classNamesTyping,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password']),
  label: PropTypes.string,
  descr: PropTypes.string,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  valid: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  prefix: PropTypes.element,
  suffix: PropTypes.element
};
