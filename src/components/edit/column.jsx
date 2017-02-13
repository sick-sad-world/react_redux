// Import utility stuff
// ===========================================================================
import { find, reduce, includes, isEqual, without, concat, pickBy, map } from 'lodash';
import classNames from 'classnames';
import { updateArrayWithValue } from '../../helpers/functions';
import { defColumnData, defColumnParameters, composeColumnSort } from '../../redux/columns';

// Import React related stuff
// ===========================================================================
import React from 'React';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from '../icon';
import EditForm from './editForm';
import Select from 'react-select';
import Toggler from '../toggler';

// Edit Column
// ===========================================================================
export default class EditColumn extends EditForm {

  mapDataToState (data) {
    return reduce(data.data, (acc, v, k) => {
      if (k === 'sort') {
        acc['sort_prefix'] = find(this.props.sortPrefix, (pref) => data.data.sort.indexOf(pref.value) > -1) || '';
        acc['sort_prop'] = find(this.props.sortProperty, (prop) => data.data.sort.indexOf(prop.value) > -1) || '';
      } else {
        acc[k] = v;
      } 
      return acc;
    }, {
      name: data.name,
      display_settings: data.display_settings,
      changed: [],
      adv_type: 'MIN',
      adv_pref: '',
      adv_prop: 'likes',
      adv_val: ''
    });
  }

  updateHandler (e) {
    e.preventDefault();
    let data = {};

    return this.props.update(data);
  }

  updateState (name, value) {
    return (e) => {
      let newState = {
        [name]: value || (name === 'display_settings') ? updateArrayWithValue(this.state.display_settings, e.target.value) : this.getValue(e)
      };
      let source = (name === 'name' || name === 'display_settings') ? this.props.data[name] : this.props.data.data[name];
      if (isEqual(newState[name], source)) {
        if (includes(this.state.changed, name)) newState.changed = without(this.state.changed, name);
      } else {
        if (!includes(this.state.changed, name)) newState.changed = concat(this.state.changed, name);
      }
      this.setState(newState);
    }
  }

  createAdvFilter () {
    return (e) => {
      e.preventDefault();
      let { adv_type, adv_pref, adv_prop, adv_val} = this.state;
      this.updateState(`${adv_type}(${(adv_pref) ? adv_pref+'_'+adv_prop : adv_prop})`, (adv_val > 0) ? adv_val: undefined);
    }
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'mod-column-edit': true,
      'state-loading': running
    });

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
                onChange={this.updateState('display_settings')}
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
      <section className={componentRootClass}>
        { this.renderFormHeader() }
        { this.renderConfirmation() }
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funColumnName'>Column name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.updateState('name')}
                id='funColumnName'
                type='text'
                name='name'
              />
            </div>
            <fieldset className='row'>
              <legend>Feeds assigned:</legend>
              <Link to={`${this.props.backPath}/${this.props.data.id}/assignment`} className='is-button is-accent'>Assign feeds</Link>
            </fieldset>
            <h4 className='form-subtitle'>Display options:</h4>
            <div className='row-flex'>
              <span className='form-label'>Display ignored items anyway</span>
              <Toggler
                disabled={running}
                name='show_ignored'
                options={{
                  'Yes': 1,
                  'No': 0
                }}
                onChange={this.updateState('show_ignored')}
                value={this.state.show_ignored} 
              />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Show only favorited items</span>
              <Toggler
                disabled={running}
                name='show_favorites'
                options={{
                  'Yes': 1,
                  'No': 0
                }}
                onChange={this.updateState('show_favorites')}
                value={this.state.show_favorites} 
              />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Infinite scroll</span>
              <Toggler
                disabled={running}
                name='infinite'
                options={{
                  'On': 1,
                  'Off': 0
                }}
                onChange={this.updateState('infinite')}
                value={this.state.infinite}
              />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Autoreloading</span>
              <Select
                disabled={running}
                className='size-120'
                name='autoreload'
                placeholder='Disabled...'
                options={this.props.autoReloadOptions}
                onChange={this.updateState('autoreload')}
                autosize={false}
                clearable={true}
                searchable={false}
                value={this.state.autoreload}
              />
            </div>
            <div className='row-flex'>
              <label htmlFor='funColumnLimit'>Max number of items:</label>
              <input 
                disabled={running}
                className='size-120'
                value={this.state.limit}
                onChange={this.updateState('limit')}
                id='funColumnLimit'
                type='number'
                name='limit'
              />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Sort results by:</span>
              <div className='sorting-selects'>
                <Select
                  disabled={running || this.state.sort_prop === 'found'}
                  className='size-120'
                  name='sort_pref'
                  placeholder='Prefix...'
                  options={this.props.sortPrefix}
                  onChange={this.updateState('sort_pref')}
                  autosize={false}
                  clearable={true}
                  searchable={false}
                  value={this.state.sort_pref}
                />
                <Select
                  disabled={running}
                  className='size-180'
                  name='sort_prop'
                  options={this.props.sortProperty}
                  onChange={this.updateState('sort_prop')}
                  autosize={false}
                  clearable={false}
                  searchable={false}
                  value={this.state.sort_prop}
                />
                <span className={`switcher-direction${(running) ? ' is-disabled' : ''}`}>
                  <input
                    type='checkbox'
                    disabled={running}
                    name='direction'
                    onChange={this.updateState('direction')}
                    checked={this.state.direction === 'desc'}
                    value={(this.state.direction === 'desc') ? 'asc' : 'desc'}
                  />
                  <Icon icon='bar-graph' />
                </span>
              </div>
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
            <div className='row-flex'>
              <span className='form-label'>Images:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_image'
                options={{
                  'Only': 1,
                  'Include': '',
                  'Omit': 0
                }}
                onChange={this.updateState('is_image')}
                value={this.state.is_image} />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Videos:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_video'
                options={{
                  'Only': 1,
                  'Include': '',
                  'Omit': 0
                }}
                onChange={this.updateState('is_video')}
                value={this.state.is_video} />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Facebook posts:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_facebook'
                options={{
                  'Only': 1,
                  'Include': '',
                  'Omit': 0
                }}
                onChange={this.updateState('is_facebook')}
                value={this.state.is_facebook} />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Galleries:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_gallery'
                options={{
                  'Only': 1,
                  'Include': '',
                  'Omit': 0
                }}
                onChange={this.updateState('is_gallery')}
                value={this.state.is_gallery} />
            </div>
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
            <div className='row'>
              <label htmlFor='funColumnSearch'>Title/description contains:</label>
              <input 
                disabled={running}
                value={this.state.search}
                onChange={this.updateState('search')}
                id='funColumnSearch'
                type='text'
                name='search'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnUrl'>URL contains:</label>
              <input 
                disabled={running}
                value={this.state.url}
                onChange={this.updateState('url')}
                id='funColumnUrl'
                type='text'
                name='url'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnAuthor'>Author contains:</label>
              <input 
                disabled={running}
                value={this.state.author}
                onChange={this.updateState('author')}
                id='funColumnAuthor'
                type='text'
                name='author'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnExclude'>Title/description does not contain:</label>
              <input 
                disabled={running}
                value={this.state.exclude_search}
                onChange={this.updateState('exclude_search')}
                id='funColumnExclude'
                type='text'
                name='exclude_search'
              />
            </div>
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
                    <li key={`${k}=${v}`}>{`${k}=${v}`}<span onClick={() => this.preformAction()(k, null)} ><Icon icon='cross' /></span></li>)
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
                  onChange={(v) => this.setState({adv_type: v.value})}
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
                  onChange={(v) => this.setState({adv_pref: v.value})}
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
                  onChange={(v) => this.setState({adv_prop: v.value})}
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
                <button onClick={this.createAdvFilter()} disabled={running} className='button is-accent size-60'>Add</button>
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
  advRegExp: /MIN|MAX|LIKE/,
  tplAdvFiltersEmpty: (<li className='is-default'><i>No advanced filters configured for this column. Click below to add one or more.</i></li>),
  ...defColumnParameters
};