// Import utility stuff
// ===========================================================================
import { find, bindAll, includes, pickBy, keys, map, omitBy, isUndefined } from 'lodash';
import classNames from 'classnames';
import { transformColumnValue, composeColumnSort } from '../../helpers/functions';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';
import Toggler from '../toggler';
import EditFormHeader from '../editHeader';
import PageEdit from '../pageEdit';

// Import actions
// ===========================================================================
import { defColumn, defColumnData, defColumnParameters } from '../../helpers/defaults';

class Edit extends PageEdit {
  constructor (props) {
    super(props, {
      name: true,
      display_settings: true,
      show_favorites: (item) => item.data.show_favorites,
      show_ignored: (item) => item.data.show_ignored,
      infinite: (item) => item.data.infinite,
      limit: (item) => item.data.limit,
      direction: (item) => item.data.direction,
      author: (item) => item.data.author,
      search: (item) => item.data.search,
      exclude_search: (item) => item.data.exclude_search,
      url: (item) => item.data.url,
      since: (item) => item.data.since,
      before: (item) => item.data.before,
      source: (item) => item.data.source,
      set: (item) => item.data.set,
      ignore_source: (item) => item.data.ignore_source,
      ignore_set: (item) => item.data.ignore_set,
      is_image: (item) => item.data.is_image,
      is_video: (item) => item.data.is_video,
      is_facebook: (item) => item.data.is_facebook,
      is_gallery: (item) => item.data.is_gallery,
      language: (item) => item.data.language,
      autoreload: (item) => item.data.autoreload,
      sort_pref (item) {
        let prefix = find(this.props.sortPrefix, (pref) => item.data.sort.indexOf(pref.value) > -1);
        return (prefix) ? prefix.value : '';
      },
      sort_prop (item) {
        let property = find(this.props.sortProperty, (prop) => item.data.sort.indexOf(prop.value) > -1);
        return (property) ? property.value : '';
      }
    });

    Object.assign(this.state, this.getAdvFiltersFromProps(this.props));
    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['preformAction', 'stateHandler', 'changeHandler', 'createSelectHandler', 'createAdvFilter', 'modifyStateArray']);
  }

  onComponentWillReceiveProps (newProps) {
    if (this.props.state !== 3) {
      this.setState(this.getAdvFiltersFromProps(newProps))
    }
  }

  // Pick adv filters and assign it to state
  // ===========================================================================
  getAdvFiltersFromProps (props) {
    return Object.assign({
      adv_type: 'MIN',
      adv_pref: null,
      adv_prop: 'likes',
      adv_val: ''
    }, pickBy(props.item.data, (v, k) => this.props.advRegExp.test(k)));
  }

  // Send request to server with new props
  // @overriding [preformAction] pageEdit.jsx:51
  // ===========================================================================
  preformAction (name) {
    return () => {
      let data = false;
      let value = this.state[name];
      let item = this.props.item;

      if (this.props.item.id) {
        // Modify if item is already existed
        // ===========================================================================
        if (name === 'name' || name === 'display_settings') {
          if (value !== this.props.item[name]) {
            data = { id: this.props.item.id, [name]: value};
          }
        } else {
          value = transformColumnValue(value);

          // Compose sorting property
          // ===========================================================================
          if (name.indexOf('sort') === 0) {
            name = 'sort';
            value = composeColumnSort(this.state.sort_pref, this.state.sort_prop);
          }

          // Proper autoreload disabled value
          // ===========================================================================
          if (name === 'autoreload' && !value) {
            value = 0;
          }

          // Actual merging of exact data Object
          // ===========================================================================
          if (value !== item.data[name]) {
            data = {
              id:this.props.item.id,
              data: omitBy(Object.assign({}, item.data, {[name]: value}), isUndefined)
            };
            delete data.data.callback;
          }
        }
        
        if (data) {
          this.actions.update(data).catch(this.actions.throwError);
        }
      }
    }
  }

  // Create advanced filter through subform
  // ===========================================================================
  createAdvFilter (e) {
    e.preventDefault();
    let { adv_type, adv_pref, adv_prop, adv_val} = this.state;
    let key = `${adv_type}(${(adv_pref) ? adv_pref+'_'+adv_prop : adv_prop})`;
    this.setState({
      [key]: adv_val
    }, this.preformAction(key));
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id || this.props.params.assignment) return null;
    let running = this.props.state > 3;
    let emptyAdvFilter = <li className='is-default'><i>No advanced filters configured for this column. Click below to add one or more.</i></li>;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'mod-column-edit': true,
      'state-loading': running
    });

    let advFilters = pickBy(this.props.item.data, (v, k) => this.props.advRegExp.test(k));

    // Create display settings
    // ===========================================================================
    let displaySettings = [];
    let displaySettingsRow = [];
    this.props.displaySettings.forEach((setting, i) => {
      displaySettingsRow.push((
        <td key={`cell${i}`}>
          <label>
            <span className={`switcher-checkbox${(running) ? ' is-disabled' : ''}`}>
              <input
                type='checkbox'
                name='display_settings'
                value={setting}
                disabled={running}
                onChange={this.modifyStateArray}
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


    // Return DOM layout
    // ===========================================================================
    return (
      <section className={componentRootClass}>
        <EditFormHeader {...this.props.headingTexts} name={this.state.name} running={running} />
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funColumnName'>Column name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.stateHandler}
                onBlur={this.changeHandler}
                id='funColumnName'
                type='text'
                name='name'
              />
            </div>
            <fieldset className='row'>
              <legend>Feeds assigned:</legend>
              <Link to={`${this.props.location.pathname}/assignment`} className='is-button is-accent'>Assign feeds</Link>
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
                onChange={this.changeHandler}
                value={this.state.show_ignored} />
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
                onChange={this.changeHandler}
                value={this.state.show_favorites} />
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
                onChange={this.changeHandler}
                value={this.state.infinite} />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Autoreloading</span>
              <Select
                disabled={running}
                className='size-120'
                name='autoreload'
                placeholder='Disabled...'
                options={this.props.autoReloadOptions}
                onChange={this.createSelectHandler('autoreload')}
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
                onChange={this.stateHandler}
                onBlur={this.changeHandler}
                id='funColumnLimit'
                type='number'
                name='limit'
              />
            </div>
            <div className='row-flex'>
              <span className='form-label'>Sort results by:</span>
              <div className='sorting-selects'>
                <Select
                  disabled={running}
                  className='size-120'
                  name='sort_pref'
                  placeholder='Prefix...'
                  options={this.props.sortPrefix}
                  onChange={this.createSelectHandler('sort_pref')}
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
                  onChange={this.createSelectHandler('sort_prop')}
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
                    onChange={this.changeHandler}
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
                  'Include': undefined,
                  'Omit': 0
                }}
                onChangege={this.stateHandler}
                onChange={this.changeHandler}
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
                  'Include': undefined,
                  'Omit': 0
                }}
                onChangege={this.stateHandler}
                onChange={this.changeHandler}
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
                  'Include': undefined,
                  'Omit': 0
                }}
                onChangege={this.stateHandler}
                onChange={this.changeHandler}
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
                  'Include': undefined,
                  'Omit': 0
                }}
                onChangege={this.stateHandler}
                onChange={this.changeHandler}
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
                onChange={this.createSelectHandler('language')}
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
                defaultValue={this.state.search}
                onChange={this.stateHandler}
                onBlur={this.changeHandler}
                id='funColumnSearch'
                type='text'
                name='search'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnUrl'>URL contains:</label>
              <input 
                disabled={running}
                defaultValue={this.state.url}
                onChange={this.stateHandler}
                onBlur={this.changeHandler}
                id='funColumnUrl'
                type='text'
                name='url'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnAuthor'>Author contains:</label>
              <input 
                disabled={running}
                defaultValue={this.state.author}
                onChange={this.stateHandler}
                onBlur={this.changeHandler}
                id='funColumnAuthor'
                type='text'
                name='author'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnExclude'>Title/description does not contain:</label>
              <input 
                disabled={running}
                defaultValue={this.state.exclude_search}
                onChange={this.stateHandler}
                onBlur={this.changeHandler}
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
                  defaultValue={this.state.since}
                  onChange={this.stateHandler}
                  onBlur={this.changeHandler}
                  placeholder='Since...'
                  className='size-120'
                  id='funColumnSince'
                  type='text'
                  name='since'
                />
                <input 
                  disabled={running}
                  defaultValue={this.state.before}
                  onChange={this.stateHandler}
                  onBlur={this.changeHandler}
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
              { (keys(advFilters).length) ?
                  map(advFilters, (v, k) => 
                    <li key={`${k}=${v}`}>{`${k}=${v}`}<span onClick={() => this.changeHandler(k, null)} ><Icon icon='cross' /></span></li>)
                      : emptyAdvFilter }
            </ul>
            <fieldset>
              <legend>Advanced filtering options:</legend>
              <div className='row-flex'>
                <Select
                  disabled={running}
                  className='size-90'
                  name='adv_type'
                  options={[{value: 'MIN', label: 'MIN'}, {value: 'MAX', label: 'MAX'}]}
                  onChange={(v) => this.setState({'adv_type': v.value})}
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
                  onChange={(e) => this.setState({'adv_val': (e.target.value.length) ? parseFloat(e.target.value) : ''})}
                  value={this.state.adv_val}
                  type='number'
                  step='0.001'
                  placeholder='Amount...'
                  name='adv_val'
                />
                <button onClick={this.createAdvFilter} className='button is-accent size-60'>Add</button>
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

// Assign default text and possible dropdown values to component
// ===========================================================================
Edit.defaultProps = Object.assign({
  headingTexts: {
    title: 'Edit column',
    description: 'Select the type of items to show in this column and how to display them.'
  }
}, defColumnParameters);

// Transform app state to component props
// @ deps -> Columns, Sources, Sets
// ===========================================================================
let mapStateToProps = ({ app, columns }, ownProps) => {
  let item = find(columns, {id: parseInt(ownProps.params.id)}) || {};
  
  if (item) {
    item.data = Object.assign({}, defColumnData, item.data);
    // Transform string -> Array
    // @ should be removed when i communicate with maarten
    // ===========================================================================
    if (typeof item.display_settings === 'string') {
      item.display_settings = item.display_settings.split(',');
    }
    if (!item.display_settings || !item.display_settings.length) {
    // Set default data if none is provided
    // ===========================================================================
      item.display_settings = defColumn.display_settings;
    }
  }

  return {
    state: app.state,
    type: 'column',
    item,
    advRegExp: /MIN|MAX|LIKE/
  };
};

export default connect(mapStateToProps)(Edit);