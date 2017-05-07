import { bindAll, map, isEqual } from 'lodash';
import { sortingOptions } from '../defaults';
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';
import Select from 'react-select';
import Icon from 'common/components/icon';

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
      advType: 'MIN',
      advPref: '',
      advProp: 'likes',
      advVal: ''
    };
  }

  updateProp(name) {
    return v => this.setState({ [name]: (v && v.value) ? v.value : '' });
  }

  updateAmount(e) {
    return this.setState({ advVal: (e.target.value.length) ? parseFloat(e.target.value) : 0 });
  }

  createValueKey() {
    const { advType, advPref, advProp } = this.state;
    return `${advType}(${(advPref) ? `${advPref}_${advProp}` : advProp})`;
  }

  createValue(e) {
    e.preventDefault();
    if (this.state.advVal > 0) {
      this.props.onChange({
        ...this.props.value,
        [this.createValueKey()]: this.state.advVal
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
          { (Object.keys(this.props.value).length) ? map(this.props.value, this.renderValue) : this.props.tplEmpty }
        </ul>
        <fieldset>
          <legend>Advanced filtering options:</legend>
          <div className='row-flex'>
            <Select
              disabled={this.props.disabled}
              className='size-90'
              name='advType'
              options={[{ value: 'MIN', label: 'MIN' }, { value: 'MAX', label: 'MAX' }]}
              onChange={this.updateProp('advType')}
              autosize={false}
              clearable={false}
              searchable={false}
              value={this.state.advType}
            />
            <Select
              disabled={this.props.disabled}
              className='size-120'
              name='advPref'
              placeholder='Prefix...'
              options={this.props.sortPrefix}
              onChange={this.updateProp('advPref')}
              autosize={false}
              clearable={true}
              searchable={false}
              value={this.state.advPref}
            />
            <Select
              disabled={this.props.disabled}
              className='size-180'
              name='advProp'
              options={this.props.sortProperty}
              onChange={this.updateProp('advProp')}
              autosize={false}
              clearable={false}
              searchable={false}
              value={this.state.advProp}
            />
            <input
              disabled={this.props.disabled}
              className='size-120'
              onChange={this.updateAmount}
              value={this.state.advVal}
              type='number'
              step='0.001'
              placeholder='Amount...'
              name='advVal'
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
  disabled: false,
  value: {},
  ...sortingOptions
};

AdvFilters.propTypes = {
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  tplEmpty: PropTypes.element.isRequired,
  sortPrefix: optionShape('string').isRequired,
  sortProperty: optionShape('string').isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
