// Import utility stuff
// ===========================================================================
import { forOwn, isEqual } from 'lodash';
import classNames from 'classnames';
import { updateArrayWithValue } from 'functions';
import { editOptions, defColumn, availableColumnData, defaultInterface } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import EditForm from 'common/components/edit-form';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';
import Sorting from './sorting';
import AdvFilters from './adv-filters';
import DisplayOptions from './display-options';

// Edit Column
// ===========================================================================
export default class EditColumn extends EditForm {

  mapDataToState(data) {
    const advancedFilters = {};
    const columnData = { ...availableColumnData };

    forOwn(data.data, (v, k) => {
      if (this.props.advRegExp.test(k)) {
        advancedFilters[k] = v;
      } else {
        columnData[k] = v;
      }
    });

    return {
      name: data.name,
      changed: [],
      advancedFilters,
      display_settings: data.display_settings,
      ...columnData
    };
  }

  compareValue(k, v) {
    return isEqual(v, (k !== 'name' || k !== 'display_settings') ? this.props.data.data[k] : this.props.data[k]);
  }

  updateSorting() {
    return data => this.stateUpdater(data);
  }

  updateFilters() {
    return data => this.stateUpdater({ advancedFilters: data });
  }

  updateHandler(e) {
    e.preventDefault();

    const data = {
      id: this.props.data.id,
      name: this.state.name,
      display_settings: this.state.display_settings,
      data: { ...this.state.advancedFilters }
    };

    forOwn(this.state, (v, k) => {
      if (
        v === '' ||                       // Not empty
        data.data.hasOwnProperty(k) ||         // Already in data
        k === 'display_settings' ||       // Not display_settings
        k === 'changed' ||                // Not changed
        k === 'advancedFilters' ||       // Not advanced filters
        (v instanceof Array && !v.length) // Not empty Array
      ) return;
      data.data[k] = v;
    });
    return this.props.update(data, this.state.changed);
  }

  getDisplaySettings(e) {
    return updateArrayWithValue(this.state.display_settings, e.target.value);
  }

  getAutoreload(e) {
    return (e) || 0;
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    const running = this.props.state > 2;

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
              options={[
                { value: 1, label: 'Yes' },
                { value: 0, label: 'No' }
              ]}
              onChange={this.updateState('show_ignored')}
              value={this.state.show_ignored}
            />
            <Toggler
              disabled={running}
              label='Show only favorited items'
              className='row-flex'
              name='show_favorites'
              options={[
                { value: 1, label: 'Yes' },
                { value: 0, label: 'No' }
              ]}
              onChange={this.updateState('show_favorites')}
              value={this.state.show_favorites}
            />
            <Toggler
              label='Infinite scroll'
              className='row-flex'
              disabled={running}
              name='infinite'
              options={[
                { value: 1, label: 'On' },
                { value: 0, label: 'Off' }
              ]}
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
            <DisplayOptions
              className='row'
              disabled={running}
              value={this.state.display_settings}
              onChange={this.updateState('display_settings', 'getDisplaySettings')}
            />
          </div>
          <div className='form-block'>
            <h4 className='form-subtitle'>Content type(s):</h4>
            <Toggler
              label='Images'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_image'
              options={[
                { value: 1, label: 'Only' },
                { value: '', label: 'Include' },
                { value: 0, label: 'Omit' }
              ]}
              onChange={this.updateState('is_image')}
              value={this.state.is_image}
            />
            <Toggler
              label='Videos'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_video'
              options={[
                { value: 1, label: 'Only' },
                { value: '', label: 'Include' },
                { value: 0, label: 'Omit' }
              ]}
              onChange={this.updateState('is_video')}
              value={this.state.is_video}
            />
            <Toggler
              label='Facebook posts'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_facebook'
              options={[
                { value: 1, label: 'Only' },
                { value: '', label: 'Include' },
                { value: 0, label: 'Omit' }
              ]}
              onChange={this.updateState('is_facebook')}
              value={this.state.is_facebook}
            />
            <Toggler
              label='Galleries'
              className='row-flex'
              togglerClassName='size-180'
              disabled={running}
              name='is_gallery'
              options={[
                { value: 1, label: 'Only' },
                { value: '', label: 'Include' },
                { value: 0, label: 'Omit' }
              ]}
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
            className=''
            value={this.state.advancedFilters}
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
  ...editOptions
};

EditColumn.propTypes = {
  data: PropTypes.shape(defaultInterface).isRequired
};
