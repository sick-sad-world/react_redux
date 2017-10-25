import { bindAll } from 'lodash';
import { conditionalRun } from 'functions';
import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';

// Dropdown form input wrapper
// ===========================================================================
export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    bindAll(this, 'updateState', 'setValue');
    this.setValueOnNewProps = conditionalRun(this, 'value', 'setValue');
  }

  setValue({ value }) {
    this.setState({ value });
  }

  componentWillReceiveProps(newProps) {
    this.setValueOnNewProps(newProps);
  }

  updateState(v) {
    let value = v;
    if (v) {
      if (v instanceof Array) {
        value = v.map(item => item.value);
      } else if (v.value) {
        value = v.value;
      }
    }

    this.setState({ value }, () => this.props.onChange(this.state.value));
  }

  render() {
    const { disabled, id, label, name, desc, options, clearable, searchable, multi, className, selectClassName } = this.props;
    const domId = id || `fun-dropdown-${name}`;
    return (
      <div className={className}>
        <label htmlFor={domId}>{label}:</label>
        <Select
          disabled={disabled}
          className={selectClassName}
          id={domId}
          name={name}
          options={options}
          onChange={this.updateState}
          value={this.state.value}
          autosize={false}
          searchable={searchable}
          clearable={clearable}
          multi={multi}
        />
        {(desc) ? <small className='form-description'>{desc}</small> : null}
      </div>
    );
  }
}

Dropdown.defaultProps = {
  disabled: false,
  searchable: false,
  clearable: false,
  multi: false
};

Dropdown.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  desc: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  options: optionShape('any').isRequired,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  multi: PropTypes.bool,
  className: PropTypes.string,
  selectClassName: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};
