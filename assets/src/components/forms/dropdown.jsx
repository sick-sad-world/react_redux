import React from 'react';
import Select from 'react-select';

// Dropdown form input wrapper
// ===========================================================================
export default class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
    this.updateState = this.updateState.bind(this);
  }
  
  updateState (v) {
    this.setState({
      value: (v && v.value) ? v.value : v
    }, () => {
      this.props.onChange(this.state.value)
    })
  }

  render () {
    let { disabled, id, label, name, desc, options, clearable, searchable, multi, className, selectClassName } = this.props;
    id = id || `fun-dropdown-${name}`;
    return (
      <div className={className}>
        <label htmlFor={id}>{label}:</label>
        <Select
          disabled={disabled}
          className={selectClassName}
          id={id}
          name={name}
          options={options}
          onChange={this.updateState}
          value={this.state.value}
          autosize={false}
          searchable={searchable || false}
          clearable={clearable || false}
          multi={multi || false}
        />
        {(desc) ? <small className='form-description'>{desc}</small> : null}
      </div>
    );
  }
}