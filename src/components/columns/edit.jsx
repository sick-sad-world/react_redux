// Import utility stuff
// ===========================================================================
import { find, bindAll, includes, without, concat, pick, isNaN } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';
import Toggler from '../toggler';
import EditFormHeader from '../editHeader';
import PageEdit from '../pageEdit';

// Import actions
// ===========================================================================
import { defColumn, defColumnData } from '../../reducers/defaults';

class Edit extends PageEdit {
  constructor (props) {
    super(props, {
      language (item) {
        return item.data && item.data.language;
      },
      autoreload (item) {
        return (item.data) ? item.data.autoreload : 0;
      },
      sort_pref (item) {
        let prefix = (item.data) ? find(this.props.sortPrefix, (pref) => item.data.sort.indexOf(pref.value) > -1) : null;
        return (prefix) ? prefix.value : '';
      },
      sort_prop (item) {
        let property = (item.data) ? find(this.props.sortProperty, (prop) => item.data.sort.indexOf(prop.value) > -1) : null;
        return (property) ? property.value : '';
      }
    });

    let regExp = /MIN|MAX|LIKE/;
    this.state.advFilters = pick(this.props.item.data, (v, k) => regExp.test(k));

    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['preformAction', 'inputHandler', 'createSelectHandler']);
  }

  // Send request to server with new props
  // @overriding [preformAction] pageEdit.jsx:51
  // ===========================================================================
  preformAction (name, value) {
    let item = this.props.item;
    let data = false;

    // Convert number to number
    // ===========================================================================
    if (!isNaN(parseFloat(value))) {
      value = parseFloat(value);
    }

    // Convert null to undefined
    // ===========================================================================
    if (value === null || (name.indexOf('is_') === 0 && value === 'on')) {
      value = undefined;
    }

    if (this.props.item.id) {
      // Modify if item is already existed
      // ===========================================================================
      switch (name) {
        case 'name':
          if (value !== item.name) {
            data = {name: value};
          }
        break;
        case 'display_settings':
          if (includes(item.display_settings, value)) {
            data = {display_settings: without(item.display_settings, value)};
          } else {
            data = {display_settings: concat(item.display_settings, value)};
          }
        break;
        default:
          // Compose sorting property
          // ===========================================================================
          if (name.indexOf('sort') === 0) {
            name = 'sort';
            value = (this.state.sort_pref) ? this.state.sort_pref + '_' + this.state.sort_prop : this.state.sort_prop;
          }

          // Proper autoreload disabled value
          // ===========================================================================
          if (name === 'autoreload' && !value) {
            value = 0;
          }

          data = { data: Object.assign({}, item.data, {[name]: value}) };
          //data.data = JSON.stringify(data.data);
        break;
      }
      console.log(name, value, data.data);
      if (data && !data.data) {
        data.id = item.id;
        this.actions.updateData(data).catch(this.actions.throwError);
      }
    }
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id) return null;
    let item = this.props.item;
    let running = this.props.appState === 3

    // Data for form heading
    // ===========================================================================
    let headingData = {
      title: 'Edit form',
      description: 'Simple edit form to manipulate entity props',
      name: item.name,
      running: running
    };

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'mod-column-edit': true,
      'state-loading': running
    });

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
                onChange={this.inputHandler}
                checked={includes(item.display_settings, setting)}
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
        <EditFormHeader {...headingData} />
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funColumnName'>Column name:</label>
              <input 
                disabled={running}
                defaultValue={item.name}
                onBlur={this.inputHandler}
                id='funColumnName'
                type='text'
                name='name'
              />
            </div>
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
                onChange={this.inputHandler}
                value={item.data.show_ignored} />
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
                onChange={this.inputHandler}
                value={item.data.show_favorites} />
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
                onChange={this.inputHandler}
                value={item.data.infinite} />
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
                value={this.state.autoreload}
              />
            </div>
            <div className='row-flex'>
              <label htmlFor='funColumnLimit'>Max number of items:</label>
              <input 
                disabled={running}
                className='size-120'
                defaultValue={item.data.limit}
                onBlur={this.inputHandler}
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
                  options={this.props.sortPrefix}
                  onChange={this.createSelectHandler('sort_pref')}
                  autosize={false}
                  clearable={true}
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
                  value={this.state.sort_prop}
                />
                <span className='switcher-direction'>
                  <input
                    type='checkbox'
                    disabled={running}
                    name='direction'
                    onChange={this.inputHandler}
                    checked={item.data.direction === 'desc'}
                    value={(item.data.direction === 'desc') ? 'asc' : 'desc'}
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
                onChange={this.inputHandler}
                value={item.data.is_image} />
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
                onChange={this.inputHandler}
                value={item.data.is_video} />
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
                onChange={this.inputHandler}
                value={item.data.is_facebook} />
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
                onChange={this.inputHandler}
                value={item.data.is_gallery} />
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
                value={this.state.language}
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnSearch'>Title/description contains:</label>
              <input 
                disabled={running}
                defaultValue={item.data.search}
                onBlur={this.inputHandler}
                id='funColumnSearch'
                type='text'
                name='search'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnUrl'>URL contains:</label>
              <input 
                disabled={running}
                defaultValue={item.data.url}
                onBlur={this.inputHandler}
                id='funColumnUrl'
                type='text'
                name='url'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnAuthor'>Author contains:</label>
              <input 
                disabled={running}
                defaultValue={item.data.author}
                onBlur={this.inputHandler}
                id='funColumnAuthor'
                type='text'
                name='author'
              />
            </div>
            <div className='row'>
              <label htmlFor='funColumnExclude'>Title/description does not contain:</label>
              <input 
                disabled={running}
                defaultValue={item.data.exclude_search}
                onBlur={this.inputHandler}
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
                  defaultValue={item.data.since}
                  onBlur={this.inputHandler}
                  placeholder='Since...'
                  className='size-120'
                  id='funColumnSince'
                  type='text'
                  name='since'
                />
                <input 
                  disabled={running}
                  defaultValue={item.data.before}
                  onBlur={this.inputHandler}
                  placeholder='Before...'
                  className='size-120'
                  id='funColumnBefore'
                  type='text'
                  name='before'
                />
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  }
}

Edit.defaultProps = {
  displaySettings: [
    'title',
    'url',
    'author',
    'found',
    'image',
    'wide_image',
    'description',
    'graphs',
    'likes',
    'tweets',
    'pins',
    'shares',
    'comments',
    'votes_video',
    'views_video',
    'comments_video'
  ], 
  language: [
    {label: 'English', value: 'English'},
    {label: 'French', value: 'French'},
    {label: 'German', value: 'German'},
    {label: 'Dutch', value: 'Dutch'},
    {label: 'Spanish', value: 'Spanish'},
    {label: 'Korean', value: 'Korean'},
    {label: 'Arabic', value: 'Arabic'},
    {label: 'Chinese', value: 'Chinese'},
    {label: 'Hindi', value: 'Hindi'},
    {label: 'Japanese', value: 'Japanese'},
    {label: 'Greek', value: 'Greek'},
    {label: 'Unknown', value: 'Unknown'},
    {label: 'Undetected', value: 'Undetected'}
  ],
  autoReloadOptions: [
    {label: '15sec', value: 15},
    {label: '30sec', value: 30},
    {label: '1min', value: 60},
    {label: '2min', value: 120},
    {label: '5min', value: 300},
    {label: '10min', value: 600}
  ],
  sortPrefix: [
    {label: 'rate', value: 'rate'},
    {label: 'maxrate', value: 'maxrate'},
    {label: 'hotness', value: 'hotness'},
    {label: 'acc', value: 'acc'}
  ],
  sortProperty: [
    {label: 'found', value: 'found'},
    {label: 'tweets', value: 'tweets'},
    {label: 'likes', value: 'likes'},
    {label: 'shares', value: 'shares'},
    {label: 'pins', value: 'pins'},
    {label: 'comments_video', value: 'comments_video'},
    {label: 'comments', value: 'comments'},
    {label: 'votes_video', value: 'votes_video'},
    {label: 'views_video', value: 'views_video'}
  ]
}

// Transform app state to component props
// @ deps -> Columns, Sources, Sets
// ===========================================================================
let mapStateToProps = ({ columns, sets, sources, app }, ownProps) => {
  let item = find(columns, {id: parseInt(ownProps.params.id)});
  
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
    appState: app.appState,
    type: 'column',
    item: item || {},
    sets,
    sources
  };
};

export default connect(mapStateToProps)(Edit);