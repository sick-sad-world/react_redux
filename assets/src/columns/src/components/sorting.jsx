import React from 'react';
import Select from 'react-select';
import Icon from '../icon';
import { defColumnSorting, decomposeColumnSort, composeColumnSort } from '../../redux/columns';

// Sorting dropdonws and direction toggler
// ===========================================================================
export default class Sorting extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.mapDataToState(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.mapDataToState(newProps));
  }

  mapDataToState({ value, direction }) {
    return {
      direction,
      ...decomposeColumnSort(value)
    };
  }

  updateState(name) {
    return v => this.setState({
      [name]: (name === 'direction') ? v.target.value : (v && v.value) ? v.value : v
    }, () => {
      this.props.onChange({
        direction: this.state.direction,
        sort: composeColumnSort(this.state.sort_pref, this.state.sort_prop)
      });
    });
  }

  render() {
    const { disabled, className, sortPrefix, sortProperty } = this.props;
    const { sort_pref, sort_prop, direction } = this.state;
    return (
      <div className={className}>
        <Select
          disabled={disabled || this.state.sort_prop === 'found'}
          className='size-120'
          name='sort_pref'
          placeholder='Prefix...'
          options={sortPrefix}
          onChange={this.updateState('sort_pref')}
          autosize={false}
          clearable={true}
          searchable={false}
          value={sort_pref}
        />
        <Select
          disabled={disabled}
          className='size-180'
          name='sort_prop'
          options={sortProperty}
          onChange={this.updateState('sort_prop')}
          autosize={false}
          clearable={false}
          searchable={false}
          value={sort_prop}
        />
        <span className={`switcher-direction${(disabled) ? ' is-disabled' : ''}`}>
          <input
            type='checkbox'
            disabled={disabled}
            name='direction'
            onChange={this.updateState('direction')}
            checked={direction === 'desc'}
            value={(direction === 'desc') ? 'asc' : 'desc'}
          />
          <Icon icon='bar-graph' />
        </span>
      </div>
    );
  }
}

Sorting.defaultProps = {
  ...defColumnSorting
};
