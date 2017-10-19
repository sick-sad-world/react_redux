// Import utility stuff
// ===========================================================================
import { forOwn, isEqual, pickBy, includes, bindAll } from 'lodash';
import { updateArrayWithValue } from 'functions';
import { availableColumnData, defaultInterface, editOptions } from '../defaults';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { optionShape } from 'common/typecheck';

// Import Child components
// ===========================================================================
import statefullForm, { injectedProps } from 'common/hocs/statefull-form';
import SectionWrapper from 'common/section';
import Confirmation from 'common/components/confirmation';
import TextInput from 'common/components/forms/input-text';
import Dropdown from 'common/components/forms/dropdown';
import Toggler from 'common/components/forms/toggler';

import Sorting from './sorting';
import AdvFilters from './adv-filters';

import { BriefList as SetList } from 'src/sets';
import { BriefList as FeedList } from 'src/feeds';
import { PickDisplaySettings } from 'src/display-settings';

const notAffecting = ['id', 'name', 'display_settings', 'advancedFilters', 'changed'];

// Edit Column
// ===========================================================================
class EditColumn extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'getDisplaySettings', 'getContentType');
  }

  getDisplaySettings(value) {
    return updateArrayWithValue(this.props.values.display_settings, value);
  }

  updateSorting() {
    return data => this.props.stateUpdater(data);
  }

  getContentType(name) {
    return (value, values) => (this.props.contentTypeEntries.reduce((acc, key) => {
      if (key !== name) {
        acc[key] = (value === 1 && values[key] === 1) ? '' : values[key];
      }
      return acc;
    }, { [name]: value }));
  }

  getContentTypeProps(label, name) {
    const { makeUpdater, state, values, contentTypeOpts, contentTypeEntries } = this.props;
    return (
      <Toggler
        label={label}
        className='row-flex'
        togglerClassName='size-180'
        disabled={state === 3}
        name={name}
        options={contentTypeOpts}
        value={values[name]}
        onChange={makeUpdater(contentTypeEntries, this.getContentType(name))}
      />
    );
  }

  render() {
    const { loading, changed, values, texts, backUrl, reset, submit, bindInput, makeUpdater } = this.props;
    const title = (values.name) ? `${texts.title} "${values.name}"` : texts.title;
    return (
      <SectionWrapper title={title} description={texts.description} url={backUrl} className='mod-column-edit'>
        {(changed.length || loading) ? (
          <Confirmation text={texts.confirmation} loading={loading} changed={changed} apply={submit} cancel={reset} />
        ) : null}
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Column name'
              disabled={loading}
              {...bindInput('name')}
            />
            <fieldset className='row'>
              <legend>Column data sources:</legend>
              <div className='brief-list-container'>
                {(SetList) ? (
                  <SetList
                    className='brief-list'
                    title='Sets assigned:'
                    criterea={{ ids: values.set }}
                    emptyText='No sets assigned to this column'
                  />
                ) : null}
                {(FeedList) ? (
                  <FeedList
                    className='brief-list'
                    title='Feeds assigned:'
                    criterea={{ ids: values.source }}
                    emptyText='No feeds assigned to this column'
                  />
                ) : null}
              </div>
              {(SetList || FeedList) ? <Link to={`${backUrl}/${values.id}/assignment`} className='button is-accent'>Assign feeds</Link> : null}
            </fieldset>
            <h4 className='form-subtitle'>Display options:</h4>
            <Toggler
              disabled={loading}
              label='Display ignored items anyway'
              className='row-flex'
              name='show_ignored'
              options={[
                { value: 1, label: 'Yes' },
                { value: 0, label: 'No' }
              ]}
              {...bindInput('show_ignored')}
            />
            <Toggler
              disabled={loading}
              label='Show only favorited items'
              className='row-flex'
              name='show_favorites'
              options={[
                { value: 1, label: 'Yes' },
                { value: 0, label: 'No' }
              ]}
              {...bindInput('show_favorites')}
            />
            <Toggler
              label='Infinite scroll'
              className='row-flex'
              disabled={loading}
              name='infinite'
              options={[
                { value: 1, label: 'On' },
                { value: 0, label: 'Off' }
              ]}
              {...bindInput('infinite')}
            />
            <Dropdown
              disabled={loading}
              className='row-flex'
              label='Autoreloading'
              selectClassName='size-120'
              name='autoreload'
              options={this.props.autoReloadOptions}
              {...bindInput('autoreload', v => v || 0)}
              clearable={true}
            />
            <TextInput
              className='row-flex'
              inputClassName='size-120'
              name='limit'
              type='number'
              label='Max number of items'
              disabled={loading}
              {...bindInput('limit')}
            />
            <div className='row-flex'>
              <span className='form-label'>Sort results by:</span>
              <Sorting
                className='sorting-selects'
                value={{ sort: values.sort, direction: values.direction }}
                disabled={loading}
                onChange={makeUpdater(['sort', 'direction'])}
              />
            </div>
            <PickDisplaySettings
              className='row display-settings'
              disabled={loading}
              {...bindInput('display_settings', this.getDisplaySettings)}
            />
          </div>
          <div className='form-block'>
            <h4 className='form-subtitle'>Content type(s):</h4>
            {this.getContentTypeProps('Images', 'is_image')}
            {this.getContentTypeProps('Videos', 'is_video')}
            {this.getContentTypeProps('Facebook posts', 'is_facebook')}
            {this.getContentTypeProps('Galleries', 'is_gallery')}
            <Dropdown
              disabled={loading}
              className='row-flex'
              label='Language'
              selectClassName='size-180'
              name='language'
              options={this.props.language}
              clearable={true}
              {...bindInput('language')}
            />
            <TextInput
              className='row'
              name='search'
              label='Title/description contains'
              disabled={loading}
              {...bindInput('search')}
            />
            <TextInput
              className='row'
              name='LIKE(url)'
              label='URL contains'
              disabled={loading}
              {...bindInput('LIKE(url)')}
            />
            <TextInput
              className='row'
              name='author'
              label='Author contains'
              disabled={loading}
              {...bindInput('author')}
            />
            <TextInput
              className='row'
              name='exclude_search'
              label='Title/description does not contains'
              disabled={loading}
              {...bindInput('exclude_search')}
            />
            <div className='row-flex'>
              <span className='form-label'>Found since/before <i><b>n</b></i> hours ago:</span>
              <div className='row-time-gap'>
                <TextInput
                  name='since'
                  inputClassName='size-120'
                  placeholder='Since...'
                  disabled={loading}
                  {...bindInput('since')}
                />
                <TextInput
                  name='before'
                  inputClassName='size-120'
                  placeholder='Before...'
                  disabled={loading}
                  {...bindInput('before')}
                />
              </div>
            </div>
          </div>
          <AdvFilters
            className=''
            disabled={loading}
            {...bindInput('advancedFilters')}
          />
        </form>
      </SectionWrapper>
    );
  }
}

EditColumn.defaultProps = {
  contentTypeEntries: ['is_image', 'is_video', 'is_gallery', 'is_facebook'],
  contentTypeOpts: [
    { value: 1, label: 'Only' },
    { value: '', label: 'Include' },
    { value: 0, label: 'Omit' }
  ],
  ...editOptions
};

EditColumn.propTypes = {
  contentTypeOpts: optionShape('any').isRequired,
  contentTypeEntries: PropTypes.arrayOf(PropTypes.string).isRequired,
  language: optionShape('string').isRequired,
  autoReloadOptions: optionShape('number').isRequired,
  advRegExp: PropTypes.instanceOf(RegExp).isRequired,
  ...injectedProps
};

export default statefullForm({
  mapDataToState(data) {
    const advancedFilters = {};
    const columnData = { ...availableColumnData };

    forOwn(data.data, (v, k) => {
      if (editOptions.advRegExp.test(k)) {
        advancedFilters[k] = v;
      } else if (k === 'LIKE(url)') {
        columnData[k] = v.substring(1, v.length - 1);
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
  },
  mapStateToData(values) {
    const dataProps = pickBy(values, (v, k) => !includes(notAffecting, k) && ((v instanceof Array) ? v.length : v !== ''));
    if (dataProps['LIKE(url)']) {
      dataProps['LIKE(url)'] = `%${dataProps['LIKE(url)']}%`;
    }
    return {
      id: values.id,
      name: values.name,
      display_settings: values.display_settings,
      data: {
        ...dataProps,
        ...values.advancedFilters
      }
    };
  },
  comparator(v, k, data) {
    switch (k) {
      case 'name':
        return v === data[k];
      case 'display_settings':
        return isEqual(data[k].sort(), v.sort());
      default:
        return isEqual(data.data[k], (v === '') ? undefined : v);
    }
  },
  propTypes: {
    data: PropTypes.shape(defaultInterface).isRequired
  }
})(EditColumn);
