// Import utility stuff
// ===========================================================================
import { forOwn, isEqual, pickBy, includes, bindAll } from 'lodash';
import { updateArrayWithValue } from 'functions';
import { availableColumnData, defaultInterface, editOptions, notAffecting } from '../defaults';

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

// Edit Column
// ===========================================================================
class EditColumn extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'getDisplaySettings', 'getContentType', 'submitForm');
  }

  getDisplaySettings(value) {
    return updateArrayWithValue(this.props.values.display_settings, value);
  }

  updateSorting() {
    return data => this.props.stateUpdater(data);
  }

  getContentType() {
    return (value, state, props, name) => {
      if (value === 1) {
        return this.props.makeUpdater({
          ...this.props.contentTypeDef,
          [name]: 1
        });
      }
      return this.props.makeUpdater({ [name]: value });
    };
  }

  getContentTypeProps(label, name, updater) {
    return (
      <Toggler
        label={label}
        className='row-flex'
        togglerClassName='size-180'
        disabled={this.props.state === 3}
        name={name}
        options={this.props.contentTypeOpts}
        value={this.props.values[name]}
        onChange={updater}
      />
    );
  }

  submitForm() {
    this.props.onSubmit(this.props.submit());
  }

  render() {
    const { state, changed, values, texts, backUrl, reset, bindInput, makeUpdater } = this.props;
    const running = state === 3;
    const title = (values.name) ? `${texts.title} "${values.name}"` : texts.title;
    const contentTypeUpdater = makeUpdater(['is_image', 'is_video', 'is_gallery', 'is_facebook'], this.getContentType);
    return (
      <SectionWrapper title={title} description={texts.description} url={backUrl} className='mod-column-edit'>
        {(changed.length) ? (
          <Confirmation text={texts.confirmation} changed={changed} apply={this.submitForm} cancel={reset} />
        ) : null}
        <form className='subsection-content columned'>
          <div className='form-block'>
            <TextInput
              className='row'
              name='name'
              label='Column name'
              disabled={running}
              {...bindInput('name')}
            />
            <fieldset className='row'>
              <legend>Column data sources:</legend>
              <div className='brief-list-container'>
                {(SetList) ? (
                  <SetList
                    className='brief-list'
                    title='Sets assigned:'
                    criterea={{ set_ids: values.set }}
                    emptyText='No sets assigned to this column'
                  />
                ) : null}
                {(FeedList) ? (
                  <FeedList
                    className='brief-list'
                    title='Feeds assigned:'
                    criterea={{ source_ids: values.source }}
                    emptyText='No feeds assigned to this column'
                  />
                ) : null}
              </div>
              {(SetList || FeedList) ? <Link to={`${backUrl}/${values.id}/assignment`} className='button is-accent'>Assign feeds</Link> : null}
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
              {...bindInput('show_ignored')}
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
              {...bindInput('show_favorites')}
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
              {...bindInput('infinite')}
            />
            <Dropdown
              disabled={running}
              className='row-flex'
              label='Autoreloading'
              selectClassName='size-120'
              name='autoreload'
              options={this.props.autoReloadOptions}
              {...bindInput('infinite', v => v || 0)}
              clearable={true}
            />
            <TextInput
              className='row-flex'
              inputClassName='size-120'
              name='limit'
              type='number'
              label='Max number of items'
              disabled={running}
              {...bindInput('limit')}
            />
            <div className='row-flex'>
              <span className='form-label'>Sort results by:</span>
              <Sorting
                className='sorting-selects'
                value={values.sort}
                direction={values.direction}
                disabled={running}
                onChange={makeUpdater('sort')}
              />
            </div>
            <PickDisplaySettings
              className='row display-settings'
              disabled={running}
              {...bindInput('display_settings', this.getDisplaySettings)}
            />
          </div>
          <div className='form-block'>
            <h4 className='form-subtitle'>Content type(s):</h4>
            {this.getContentTypeProps('Images', 'is_image', contentTypeUpdater)}
            {this.getContentTypeProps('Videos', 'is_video', contentTypeUpdater)}
            {this.getContentTypeProps('Facebook posts', 'is_facebook', contentTypeUpdater)}
            {this.getContentTypeProps('Galleries', 'is_gallery', contentTypeUpdater)}
            <Dropdown
              disabled={running}
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
              disabled={running}
              {...bindInput('search')}
            />
            <TextInput
              className='row'
              name='LIKE(url)'
              label='URL contains'
              disabled={running}
              {...bindInput('LIKE(url)')}
            />
            <TextInput
              className='row'
              name='author'
              label='Author contains'
              disabled={running}
              {...bindInput('author')}
            />
            <TextInput
              className='row'
              name='exclude_search'
              label='Title/description does not contains'
              disabled={running}
              {...bindInput('exclude_search')}
            />
            <div className='row-flex'>
              <span className='form-label'>Found since/before <i><b>n</b></i> hours ago:</span>
              <div className='row-time-gap'>
                <TextInput
                  name='since'
                  inputClassName='size-120'
                  placeholder='Since...'
                  disabled={running}
                  {...bindInput('since')}
                />
                <TextInput
                  name='before'
                  inputClassName='size-120'
                  placeholder='Before...'
                  disabled={running}
                  {...bindInput('before')}
                />
              </div>
            </div>
          </div>
          <AdvFilters
            className=''
            disabled={running}
            {...bindInput('advancedFilters')}
          />
        </form>
      </SectionWrapper>
    );
  }
}

EditColumn.defaultProps = {
  contentTypeDef: {
    is_image: '',
    is_video: '',
    is_gallery: '',
    is_facebook: ''
  },
  contentTypeOpts: [
    { value: 1, label: 'Only' },
    { value: '', label: 'Include' },
    { value: 0, label: 'Omit' }
  ],
  notAffecting: [...notAffecting],
  ...editOptions
};

EditColumn.propTypes = {
  contentTypeOpts: optionShape('any').isRequired,
  contentTypeDef: PropTypes.shape({
    is_image: PropTypes.string.isRequired,
    is_video: PropTypes.string.isRequired,
    is_gallery: PropTypes.string.isRequired,
    is_facebook: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
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
  mapStateToData(state, props) {
    const dataProps = pickBy(state, (v, k) => !includes(props.notAffecting, k) && ((v instanceof Array) ? v.length : v !== ''));
    if (dataProps['LIKE(url)']) dataProps['LIKE(url)'] = `%${dataProps['LIKE(url)']}%`;
    return {
      id: state.id,
      name: state.name,
      display_settings: state.display_settings,
      data: {
        ...dataProps,
        ...state.advancedFilters
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
