// Import utility stuff
// ===========================================================================
import { find, reduce, includes } from 'lodash';
import classNames from 'classnames';
import { updateArrayWithValue } from '../../helpers/functions';
import { defColumnParameters, composeColumnSort } from '../../redux/columns';

// Import React related stuff
// ===========================================================================
import React from 'React';

// Import Child components
// ===========================================================================
import EditForm from './editForm';
import Select from 'react-select';
import Toggler from '../toggler';

// Edit Column
// ===========================================================================
export default class EditColumn extends EditForm {

  mapDataToState (data) {
    let prefix = data.data.sort && find(this.props.sortPrefix, (pref) => data.data.sort.indexOf(pref.value) > -1);
    let property = data.data.sort && find(this.props.sortProperty, (prop) => data.data.sort.indexOf(prop.value) > -1);
    return {
      changed: [],
      name: data.name,
      display_settings: (data.display_settings) ? data.display_settings : defColumnParameters.displaySettingsDefaults,
      show_favorites: (data.data.show_favorites) ? data.data.show_favorites : '',
      show_ignored: (data.data.show_ignored) ? data.data.show_ignored : '',
      infinite: (data.data.infinite) ? data.data.infinite : '',
      limit: (data.data.limit) ? data.data.limit : '',
      direction: (data.data.direction) ? data.data.direction : '',
      author: (data.data.author) ? data.data.author : '',
      search: (data.data.search) ? data.data.search : '',
      exclude_search: (data.data.exclude_search) ? data.data.exclude_search : '',
      url: (data.data.url) ? data.data.url : '',
      since: (data.data.since) ? data.data.since : '',
      before: (data.data.before) ? data.data.before : '',
      source: (data.data.source) ? data.data.source : [],
      set: (data.data.set) ? data.data.set : [],
      ignore_source: (data.data.ignore_source) ? data.data.ignore_source : [],
      ignore_set: (data.data.ignore_set) ? data.data.ignore_set : [],
      is_image: (data.data.is_image === null) ? 'on' : data.data.is_image,
      is_video: (data.data.is_video === null) ? 'on' : data.data.is_video,
      is_facebook: (data.data.is_facebook === null) ? 'on' : data.data.is_facebook,
      is_gallery: (data.data.is_gallery === null) ? 'on' : data.data.is_gallery,
      language: (data.data.language) ? data.data.language : '',
      autoreload: (data.data.autoreload) ? data.data.autoreload : '',
      sort_pref: (prefix) ? prefix.value : '',
      sort_prop: (property) ? property.value : ''
    };
  }

  updateHandler (e) {
    e.preventDefault();
    let data = reduce(this.state, (acc, v, k) => {
      if (includes(this.state.changed, k)) {
        if (k === 'name' || k === 'display_settings') {
          acc[k] = v;
        } else {
          if (!acc.data) acc.data = {};
          if (k.indexOf('sort') === 0 && !acc.data.sort) {
            acc.data[k] = composeColumnSort(this.state.sort_pref, this.state.sort_prop);
          } else if (k === 'autoreload' && !v) {
            acc.data.autoreload = 0;
          } else {
            (this.state[k] instanceof Array) ? updateArrayWithValue(data[name], v) : v
          }
        }
      }
      return acc;
    }, {});

    return this.props.update(data);
  }

  render () {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.data) return null;
    let running = this.props.state > 2;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
    });

    return (
      <section className={componentRootClass}>
        { this.renderFormHeader() }
        { this.renderConfirmation() }
        <form className='subsection-content columned'>
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