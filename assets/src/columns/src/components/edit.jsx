// Import utility stuff
// ===========================================================================
import { forOwn, isEqual, pickBy } from 'lodash';
import { updateArrayWithValue } from 'functions';
import { availableColumnData, defaultInterface, notDataProps } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';

// Import Child components
// ===========================================================================
import { Link } from 'react-router';
import MakeEditForm, { injectedPropsType } from 'common/hocs/edit-form';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';
import Sorting from './sorting';
import AdvFilters from './adv-filters';
import DisplayOptions from './display-options';

// Edit Column
// ===========================================================================
class EditColumn extends React.Component {

  static getTypeCheck() {
    return {
      data: PropTypes.shape(defaultInterface).isRequired
    };
  }

  static mapDataToState(data, props) {
    const advancedFilters = {};
    const columnData = { ...availableColumnData };

    forOwn(data.data, (v, k) => {
      if (props.advRegExp.test(k)) {
        advancedFilters[k] = v;
      } else {
        columnData[k] = v;
      }
    });

    return {
      id: data.id,
      name: data.name,
      changed: [],
      advancedFilters,
      display_settings: data.display_settings,
      ...columnData
    };
  }

  static mapStateToData(state, data, changed, props) {
    return {
      id: state.id,
      name: state.name,
      display_settings: state.display_settings,
      data: {
        ...pickBy(state, (v, k) => notDataProps.indexOf(k) < 0 && ((v instanceof Array) ? v.length : v !== '')),
        ...state.advancedFilters
      }
    };
  }

  static compareValue(v, k, data) {
    switch (k) {
      case 'name':
        return v === data[k];
      case 'display_settings':
        return isEqual(data[k].sort(), v.sort());
      default:
        return isEqual(data.data[k], (v === '') ? undefined : v);
    }
  }

  static getDisplaySettings(value, props, state) {
    return updateArrayWithValue(state.display_settings, value);
  }

  static getAutoreload(value) {
    return value || 0;
  }

  updateSorting() {
    return data => this.props.stateUpdater(data);
  }

  updateFilters() {
    return data => this.props.stateUpdater({ advancedFilters: data });
  }

  render() {
    const { running, formValues, updateState } = this.props;
    return (
      <form className='subsection-content columned'>
        <div className='form-block'>
          <TextInput
            className='row'
            name='name'
            label='Column name'
            disabled={running}
            value={formValues.name}
            onChange={updateState('name')}
          />
          <fieldset className='row'>
            <legend>Feeds assigned:</legend>
            <Link to={`${this.props.path}/assignment`} className='is-button is-accent'>Assign feeds</Link>
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
            onChange={updateState('show_ignored')}
            value={formValues.show_ignored}
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
            onChange={updateState('show_favorites')}
            value={formValues.show_favorites}
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
            onChange={updateState('infinite')}
            value={formValues.infinite}
          />
          <Dropdown
            disabled={running}
            className='row-flex'
            label='Autoreloading'
            selectClassName='size-120'
            name='autoreload'
            options={this.props.autoReloadOptions}
            onChange={updateState('autoreload', 'getAutoreload')}
            clearable={true}
            value={formValues.autoreload}
          />
          <TextInput
            className='row-flex'
            inputClassName='size-120'
            name='limit'
            type='number'
            label='Max number of items'
            disabled={running}
            value={formValues.limit}
            onChange={updateState('limit')}
          />
          <div className='row-flex'>
            <span className='form-label'>Sort results by:</span>
            <Sorting
              className='sorting-selects'
              value={formValues.sort}
              direction={formValues.direction}
              disabled={running}
              onChange={this.updateSorting()}
            />
          </div>
          <DisplayOptions
            className='row'
            disabled={running}
            value={formValues.display_settings}
            onChange={updateState('display_settings', 'getDisplaySettings')}
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
            onChange={updateState('is_image')}
            value={formValues.is_image}
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
            onChange={updateState('is_video')}
            value={formValues.is_video}
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
            onChange={updateState('is_facebook')}
            value={formValues.is_facebook}
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
            onChange={updateState('is_gallery')}
            value={formValues.is_gallery}
          />
          <Dropdown
            disabled={running}
            className='row-flex'
            label='Language'
            selectClassName='size-180'
            name='language'
            options={this.props.language}
            onChange={updateState('language')}
            clearable={true}
            value={formValues.language}
          />
          <TextInput
            className='row'
            name='search'
            label='Title/description contains'
            disabled={running}
            value={formValues.search}
            onChange={updateState('search')}
          />
          <TextInput
            className='row'
            name='url'
            label='URL contains'
            disabled={running}
            value={formValues.url}
            onChange={updateState('url')}
          />
          <TextInput
            className='row'
            name='author'
            label='Author contains'
            disabled={running}
            value={formValues.author}
            onChange={updateState('author')}
          />
          <TextInput
            className='row'
            name='exclude_search'
            label='Title/description does not contains'
            disabled={running}
            value={formValues.exclude_search}
            onChange={updateState('exclude_search')}
          />
          <div className='row-flex'>
            <span className='form-label'>Found since/before <i><b>n</b></i> hours ago:</span>
            <div className='row-time-gap'>
              <TextInput
                name='since'
                inputClassName='size-120'
                placeholder='Since...'
                disabled={running}
                value={formValues.since}
                onChange={updateState('since')}
              />
              <TextInput
                name='before'
                inputClassName='size-120'
                placeholder='Before...'
                disabled={running}
                value={formValues.before}
                onChange={updateState('before')}
              />
            </div>
          </div>
        </div>
        <AdvFilters
          className=''
          value={formValues.advancedFilters}
          disabled={running}
          onChange={this.updateFilters()}
        />
      </form>
    );
  }
}

EditColumn.propTypes = {
  path: PropTypes.string.isRequired,
  language: optionShape('string').isRequired,
  autoReloadOptions: optionShape('number').isRequired,
  advRegExp: PropTypes.instanceOf(RegExp).isRequired,
  ...injectedPropsType
};

export default MakeEditForm(EditColumn);
