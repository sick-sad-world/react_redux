// Import utility stuff
// ===========================================================================
import { includes, forOwn} from 'lodash';
import classNames from 'classnames';
import { updateArrayWithValue } from '../../helpers/functions';
import { defColumnParameters } from '../../redux/columns';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import Icon from '../icon';
import EditForm from './edit-form';
import Sorting from '../forms/sorting';
import TextInput from '../forms/input-text';
import Dropdown from '../forms/dropdown';
import Toggler from '../forms/toggler';
import AdvFilters from '../forms/adv-filters';

// Edit Column
// ===========================================================================
export default class EditColumn extends EditForm {

  mapDataToState (data) {
    let advanced_filters = {};
    let columnData = {};

    forOwn(data.data, (v, k) => {
      if (this.props.advRegExp.test(k)) {
        advanced_filters[k] = v;
      } else {
        columnData[k] = v;
      }
    })

    return {
      name: data.name,
      changed: [],
      advanced_filters,
      display_settings: data.display_settings,
      ...columnData
    };
  }

  updateSorting () {
    return (data) => this.stateUpdater(data);
  }

  updateFilters () {
    return (data) => this.stateUpdater({advanced_filters: data});
  }

  updateHandler (e) {
    e.preventDefault();

    let data = {
      id: this.props.data.id,
      name: this.state.name,
      display_settings: this.state.display_settings,
      data: {...this.state.advanced_filters}
    };

    forOwn(this.state, (v, k) => {
      if (
        v === '' ||                       // Not empty
        data.hasOwnProperty(k) ||         // Already in data
        k === 'display_settings' ||       // Not display_settings
        k === 'changed' ||                // Not changed
        k === 'advanced_filters' ||             // Not advanced filters
        (v instanceof Array && !v.length) // Not empty Array
      ) return;
      data.data[k] = v;
    });
    return this.props.update(data, this.state.changed);
  }

  getDisplaySettings(e) {
    return updateArrayWithValue(this.state.display_settings, e.target.value);
  }

  getAutoreload (e) {
    return (e) ? e : 0;
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

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
            <Dropdown
              disabled={running}
              className='row-flex'
              label='Autoreloading'
              selectClassName='size-120'
              name='autoreload'
              options={this.props.autoReloadOptions}
              onChange={this.updateState('autoreload', 'getAutoreload')}
              clearable={true}
              value={this.state.autoreload}
            />
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
            <Dropdown
              disabled={running}
              className='row-flex'
              label='Language'
              selectClassName='size-180'
              name='language'
              options={this.props.language}
              onChange={this.updateState('language')}
              clearable={true}
              value={this.state.language}
            />
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
          <AdvFilters
            value={this.state.advanced_filters}
            disabled={running}
            onChange={this.updateFilters()}
          />
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
  ...defColumnParameters
};