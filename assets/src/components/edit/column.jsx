// Import utility stuff
// ===========================================================================
import { includes, pickBy, map, forOwn } from 'lodash';
import classNames from 'classnames';
import { updateArrayWithValue } from '../../helpers/functions';
import { defColumnParameters, defColumn } from '../../redux/columns';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from '../icon';
import Sorting from '../forms/sorting';
import TextInput from '../forms/input-text';
import EditForm from './edit-form';
import Select from 'react-select';
import Toggler from '../forms/toggler';

// Edit Column
// ===========================================================================
export default class EditColumn extends EditForm {

  mapDataToState (data) {
    let display_settings =  data.display_settings || defColumn.display_settings;
    return {
      ...defColumn.data,
      ...data.data,
      name: data.name,
      display_settings: (typeof display_settings === 'string') ? display_settings.split(',') : display_settings,
      changed: [],
      adv_type: 'MIN',
      adv_pref: '',
      adv_prop: 'likes',
      adv_val: ''
    };
  }

  updateSorting () {
    return (sorting) => {
      this.stateUpdater(sorting);
    };
  }

  updateHandler (e) {
    e.preventDefault();

    let data = {
      id: this.props.data.id,
      name: this.state.name,
      display_settings: this.state.display_settings,
      data: {}
    };

    forOwn(this.state, (v, k) => {
      if (
        v === '' ||
        data.hasOwnProperty(k) ||
        k === 'display_settings' ||
        k === 'changed' ||
        k.indexOf('sort') === 0 ||
        k.indexOf('adv_') === 0 ||
        (v instanceof Array && !v.length)
      ) return;
      data.data[k] = v;
    });
    return this.props.update(data, this.state.changed);
  }

  createAdvFilter () {
    return (e) => {
      e.preventDefault();
      let { adv_type, adv_pref, adv_prop, adv_val} = this.state;
      let name = `${adv_type}(${(adv_pref) ? adv_pref+'_'+adv_prop : adv_prop})`;
      this.stateUpdater({
        [name]: (adv_val > 0) ? adv_val: undefined
      });
    }
  }

  removeAdvFilter (name) {
    return () => this.stateUpdater({name: undefined});
  }

  getDisplaySettings(e) {
    return updateArrayWithValue(this.state.display_settings, e.target.value);
  }

  getAutoreload (e) {
    return (e) ? e.value : 0;
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let advFilters = pickBy(this.state, (v, k) => this.props.advRegExp.test(k) && v !== undefined);

    // Create display settings
    // ===========================================================================
    let displaySettings = [];
    let displaySettingsRow = [];
    this.props.displaySettings.forEach((setting, i) => {
      let isWideImageDisabled = setting === 'wide_image' && !includes(this.state.display_settings, 'image');
      displaySettingsRow.push((
        <td key={`cell${i}`}>
          <label>
            <span className={`switcher-checkbox${(running || isWideImageDisabled) ? ' is-disabled' : ''}`}>
              <input
                type='checkbox'
                name='display_settings'
                value={setting}
                disabled={running || isWideImageDisabled}
                onChange={this.updateState('display_settings', 'getDisplaySettings')}
                checked={includes(this.state.display_settings, setting)}
              />
              <Icon icon='check' />
            </span>
            {setting}
          </label>
        </td>
      ));
      if (i % 3 === 2 && (i + 1) !== this.props.displaySettings.length) {
        displaySettings.push(<tr key={`row${i}`}>{displaySettingsRow}</tr>);
        displaySettingsRow = [];
      }
    });

    return (
      <section className={classNames({
        'mod-subsection-edit': true,
        'mod-column-edit': true,
        'state-loading': running
      })}>
        { this.renderFormHeader() }
        { this.renderConfirmation() }
        <form className='subsection-content columned' onSubmit={this.updateHandler}>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Column name'
              disabled={running}
              value={this.state.name}
              onChange={this.updateState('name')}
            />
            <fieldset className='row'>
              <legend>Feeds assigned:</legend>
              <Link to={`${this.props.backPath}/${this.props.data.id}/assignment`} className='is-button is-accent'>Assign feeds</Link>
            </fieldset>
            <h4 className='form-subtitle'>Display options:</h4>
            <Toggler
              disabled={running}
              label='Display ignored items anyway'
              className='row-flex'
              name='show_ignored'
              options={{
                'Yes': 1,
                'No': 0
              }}
              onChange={this.updateState('show_ignored')}
              value={this.state.show_ignored} 
            />
            <Toggler
              disabled={running}
              label='Show only favorited items'
              className='row-flex'
              name='show_favorites'
              options={{
                'Yes': 1,
                'No': 0
              }}
              onChange={this.updateState('show_favorites')}
              value={this.state.show_favorites} 
            />
            <Toggler
              label='Infinite scroll'
              className='row-flex'
              disabled={running}
              name='infinite'
              options={{
                'On': 1,
                'Off': 0
              }}
              onChange={this.updateState('infinite')}
              value={this.state.infinite}
            />
            <div className='row-flex'>
              <span className='form-label'>Autoreloading</span>
              <Select
                disabled={running}
                className='size-120'
                name='autoreload'
                placeholder='Disabled...'
                options={this.props.autoReloadOptions}
                onChange={this.updateState('autoreload', 'getAutoreload')}
                autosize={false}
                clearable={true}
                searchable={false}
                value={this.state.autoreload}
              />
            </div>
            <TextInput
              className='row-flex'
              inputClassName='size-120'
              name='limit'
              type='number'
              label='Max number of items'
              disabled={running}
              value={this.state.limit}
              onChange={this.updateState('limit')}
            />
            <div className='row-flex'>
              <span className='form-label'>Sort results by:</span>
              <Sorting
                className='sorting-selects'
                value={this.state.sort}
                direction={this.state.direction}
                disabled={running}
                onChange={this.updateSorting()}
              />
            </div>
            <fieldset className='row'>
              <legend>Select what to display for each item</legend>
              <table className='is-slim'>
                <tbody>{displaySettings}</tbody>
              </table>
            </fieldset>
          </div>
          <div className='form-block'>
            <h4 className='form-subtitle'>Content type(s):</h4>
            <Toggler
              label='Images'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_image'
              options={{
                'Only': 1,
                'Include': '',
                'Omit': 0
              }}
              onChange={this.updateState('is_image')}
              value={this.state.is_image}
            />
            <Toggler
              label='Videos'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_video'
              options={{
                'Only': 1,
                'Include': '',
                'Omit': 0
              }}
              onChange={this.updateState('is_video')}
              value={this.state.is_video}
            />
            <Toggler
              label='Facebook posts'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_facebook'
              options={{
                'Only': 1,
                'Include': '',
                'Omit': 0
              }}
              onChange={this.updateState('is_facebook')}
              value={this.state.is_facebook}
            />
            <Toggler
              label='Galleries'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_gallery'
              options={{
                'Only': 1,
                'Include': '',
                'Omit': 0
              }}
              onChange={this.updateState('is_gallery')}
              value={this.state.is_gallery}
            />
            <div className='row-flex'>
              <span className='form-label'>Language:</span>
              <Select
                disabled={running}
                className='size-180'
                name='language'
                placeholder='Any'
                options={this.props.language}
                onChange={this.updateState('language')}
                autosize={false}
                clearable={true}
                searchable={false}
                value={this.state.language}
              />
            </div>
            <TextInput
              className='row'
              name='search'
              label='Title/description contains'
              disabled={running}
              value={this.state.search}
              onChange={this.updateState('search')}
            />
            <TextInput
              className='row'
              name='url'
              label='URL contains'
              disabled={running}
              value={this.state.url}
              onChange={this.updateState('url')}
            />
            <TextInput
              className='row'
              name='author'
              label='Author contains'
              disabled={running}
              value={this.state.author}
              onChange={this.updateState('author')}
            />
            <TextInput
              className='row'
              name='exclude_search'
              label='Title/description does not contains'
              disabled={running}
              value={this.state.exclude_search}
              onChange={this.updateState('exclude_search')}
            />
            <div className='row-flex'>
              <span className='form-label'>Found since/before <i><b>n</b></i> hours ago:</span>
              <div className='row-time-gap'>
                <input 
                  disabled={running}
                  value={this.state.since}
                  onChange={this.updateState('since')}
                  placeholder='Since...'
                  className='size-120'
                  id='funColumnSince'
                  type='text'
                  name='since'
                />
                <input 
                  disabled={running}
                  value={this.state.before}
                  onChange={this.updateState('before')}
                  placeholder='Before...'
                  className='size-120'
                  id='funColumnBefore'
                  type='text'
                  name='before'
                />
              </div>
            </div>
          </div>
          <div className='form-block adv-filters'>
            <ul className='tag-list row'>
              { (Object.keys(advFilters).length) ?
                  map(advFilters, (v, k) => 
                    <li key={`${k}=${v}`}>{`${k}=${v}`}<span onClick={this.removeAdvFilter(k)} ><Icon icon='cross' /></span></li>)
                      : this.props.tplAdvFiltersEmpty }
            </ul>
            <fieldset>
              <legend>Advanced filtering options:</legend>
              <div className='row-flex'>
                <Select
                  disabled={running}
                  className='size-90'
                  name='adv_type'
                  options={[{value: 'MIN', label: 'MIN'}, {value: 'MAX', label: 'MAX'}]}
                  onChange={(v) => this.setState({adv_type: (v) ? v.value : ''})}
                  autosize={false}
                  clearable={false}
                  searchable={false}
                  value={this.state.adv_type}
                />
                <Select
                  disabled={running}
                  className='size-120'
                  name='adv_pref'
                  placeholder='Prefix...'
                  options={this.props.sortPrefix}
                  onChange={(v) => this.setState({adv_pref: (v) ? v.value : ''})}
                  autosize={false}
                  clearable={true}
                  searchable={false}
                  value={this.state.adv_pref}
                />
                <Select
                  disabled={running}
                  className='size-180'
                  name='adv_prop'
                  options={this.props.sortProperty}
                  onChange={(v) => this.setState({adv_prop: (v) ? v.value : ''})}
                  autosize={false}
                  clearable={false}
                  searchable={false}
                  value={this.state.adv_prop}
                />
                <input 
                  disabled={running}
                  className='size-120'
                  onChange={(e) => this.setState({adv_val: (e.target.value.length) ? parseFloat(e.target.value) : 0})}
                  value={this.state.adv_val}
                  type='number'
                  step='0.001'
                  placeholder='Amount...'
                  name='adv_val'
                />
                <a onClick={this.createAdvFilter()} disabled={running} className='button is-accent size-60'>Add</a>
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
        </form>
      </section>
    );
  }
}

EditColumn.defaultProps = {
  texts: {
    title: 'Edit column',
    description: 'Select the type of items to show in this column and how to display them.',
    confirmation: '{data} was changed. Save changes?'
  },
  tplAdvFiltersEmpty: (<li className='is-default'><i>No advanced filters configured for this column. Click below to add one or more.</i></li>),
  ...defColumnParameters
};