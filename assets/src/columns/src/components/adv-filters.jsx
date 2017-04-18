import { bindAll, map, isEqual } from 'lodash';
import { defColumnSorting } from '../../redux/columns';
import React from 'react';
import Icon from '../icon';
import Select from 'react-select';

// Advanced filters form Component
// ===========================================================================
export default class AdvFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.mapDataToState(this.data);
    bindAll(this, 'updateAmount', 'createValue', 'renderValue');
  }

  componentWillReceiveProps(newProps) {
    if (!isEqual(this.props.value, newProps.value)) this.setState(this.mapDataToState(newProps));
  }

  mapDataToState(data) {
    return {
      adv_type: 'MIN',
      adv_pref: '',
      adv_prop: 'likes',
      adv_val: ''
    };
  }

  updateProp(name) {
    return v => this.setState({ [name]: (v && v.value) ? v.value : '' });
  }

  updateAmount(e) {
    return this.setState({ adv_val: (e.target.value.length) ? parseFloat(e.target.value) : 0 });
  }

  createValueKey() {
    const { adv_type, adv_pref, adv_prop } = this.state;
    return `${adv_type}(${(adv_pref) ? `${adv_pref}_${adv_prop}` : adv_prop})`;
  }

  createValue(e) {
    e.preventDefault();
    if (this.state.adv_val > 0) {
      this.props.onChange({
        ...this.props.value,
        [this.createValueKey()]: this.state.adv_val
      });
    }
  }

  removeValue(key) {
    return () => this.props.onChange({ ...this.props.value, [key]: undefined });
  }

  renderValue(v, k) {
    return <li key={`${k}=${v}`}>{`${k}=${v}`}<span onClick={this.removeValue(k)} ><Icon icon='cross' /></span></li>;
  }

  render() {
    return (
      <div className='form-block adv-filters'>
        <ul className='tag-list row'>
          { (Object.keys(this.props.value).length) ? map(this.props.value, this.renderValue) : this.props.tplAdvFiltersEmpty }
        </ul>
        <fieldset>
          <legend>Advanced filtering options:</legend>
          <div className='row-flex'>
            <Select
              disabled={this.props.disabled}
              className='size-90'
              name='adv_type'
              options={[{ value: 'MIN', label: 'MIN' }, { value: 'MAX', label: 'MAX' }]}
              onChange={this.updateProp('adv_type')}
              autosize={false}
              clearable={false}
              searchable={false}
              value={this.state.adv_type}
            />
            <Select
              disabled={this.props.disabled}
              className='size-120'
              name='adv_pref'
              placeholder='Prefix...'
              options={this.props.sortPrefix}
              onChange={this.updateProp('adv_pref')}
              autosize={false}
              clearable={true}
              searchable={false}
              value={this.state.adv_pref}
            />
            <Select
              disabled={this.props.disabled}
              className='size-180'
              name='adv_prop'
              options={this.props.sortProperty}
              onChange={this.updateProp('adv_prop')}
              autosize={false}
              clearable={false}
              searchable={false}
              value={this.state.adv_prop}
            />
            <input
              disabled={this.props.disabled}
              className='size-120'
              onChange={this.updateAmount}
              value={this.state.adv_val}
              type='number'
              step='0.001'
              placeholder='Amount...'
              name='adv_val'
            />
            <a onClick={this.createValue} disabled={this.props.disabled} className='button is-accent size-60'>Add</a>
          </div>
        </fieldset>
        <small className='form-description row'>
          <p>Use advanced filters to set additional limits on the values certain attributes of the items in the column can have. Use the ADD button to add a new advanced filter. Multiple advanced filters can be active at the same time.</p>
          <dl>
            <dt>MAX(xxxxx)</dt>
            <dd>maximum allowed value for xxxxxx (where xxxxx is a valid column name*)</dd>
          </dl>
          <dl>
            <dt>MIN(xxxxx)</dt>
            <dd>minimum allowed value for xxxxxx (where xxxxx is a valid column name*)</dd>
          </dl>
        </small>
      </div>
    );
  }
}

AdvFilters.defaultProps = {
  tplEmpty: (<li className='is-default'><i>No advanced filters configured for this column. Click below to add one or more.</i></li>),
  ...defColumnSorting
};
