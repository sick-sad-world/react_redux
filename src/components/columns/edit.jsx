// Import utility stuff
// ===========================================================================
import { find, bindAll, includes, pickBy, keys, map, reduce, isUndefined, isNull } from 'lodash';
import classNames from 'classnames';
import { inject, composeColumData, shouldFetchResults } from '../../helpers/functions';
import editable from '../behaviours/editable';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';
import Toggler from '../toggler';

// Import actions
// ===========================================================================
import { createResultAction, createAction, throwError } from '../../actions/actions';
import { ensureColumnData } from '../../helpers/functions';
import { defColumn, defColumnParameters } from '../../helpers/defaults';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    inject(this, editable);
    this.stateMap = {
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
      is_image: (item) => (isNull(item.data.is_image)) ? 'on' : item.data.is_image,
      is_video: (item) => (isNull(item.data.is_video)) ? 'on' : item.data.is_video,
      is_facebook: (item) => (isNull(item.data.is_facebook)) ? 'on' : item.data.is_facebook,
      is_gallery: (item) => (isNull(item.data.is_gallery)) ? 'on' : item.data.is_gallery,
      language: (item) => item.data.language,
      autoreload: (item) => item.data.autoreload,
      sort_pref (item) {
        let prefix = item.data.sort && find(this.props.sortPrefix, (pref) => item.data.sort.indexOf(pref.value) > -1);
        return (prefix) ? prefix.value : '';
      },
      sort_prop (item) {
        let property = item.data.sort && find(this.props.sortProperty, (prop) => item.data.sort.indexOf(prop.value) > -1);
        return (property) ? property.value : '';
      }
    };

    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['createAdvFilter']);

    this.state = Object.assign({
      adv_type: 'MIN',
      adv_pref: null,
      adv_prop: 'likes',
      adv_val: ''
    }, this.mapItemToState(this.props.item), pickBy(this.props.item.data, (v, k) => this.props.advRegExp.test(k)));

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      update: createAction('column', 5),
      refresh: createResultAction(3),
      throwError: throwError
    }, this.props.dispatch);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.state <= 2) {
      this.setState(Object.assign(
        this.mapItemToState(newProps.item),
        reduce(this.state, (acc, v, k) => {
          if (this.props.advRegExp.test(k)) {
            acc[k] = undefined;
          }
          return acc;
        }, {}),
        pickBy(newProps.item.data, (v, k) => this.props.advRegExp.test(k))
      ));
    }
  } 

  // Send request to server with new props
  // @overriding [preformAction] pageEdit.jsx:51
  // ===========================================================================
  preformAction (name) {
    return () => {
      let result = false;
      let value = this.state[name];
      let item = this.props.item;
      let id = item.id;

      if (id) {
        // Modify if item is already existed
        // ===========================================================================
        if (name === 'name' || name === 'display_settings') {
          if (value !== this.props.item[name]) {
            result = { [name]: value };
          }
        } else {
          result = composeColumData.call(this, item.data, name, this.state[name]);
        }
        
        if (!result) return;
        this.actions.update(result, { id }).then(({payload}) => {
          return (shouldFetchResults(payload, name)) ? this.actions.refresh(payload.data, {id}) : null;
        }).catch(this.actions.throwError);
      }
    }
  }

  // Create advanced filter through subform
  // ===========================================================================
  createAdvFilter (e) {
    e.preventDefault();
    let { adv_type, adv_pref, adv_prop, adv_val} = this.state;
    this._runStatefullAction(`${adv_type}(${(adv_pref) ? adv_pref+'_'+adv_prop : adv_prop})`, adv_val);
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item.id || this.props.params.assignment) return null;
    let { texts, item } = this.props; 
    let running = this.props.state > 3;
    let emptyAdvFilter = <li className='is-default'><i>No advanced filters configured for this column. Click below to add one or more.</i></li>;

    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'mod-column-edit': true,
      'state-loading': running
    });

    let advFilters = pickBy(this.state, (v, k) => this.props.advRegExp.test(k) && !isUndefined(v));

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
                onChange={this.updateValue}
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
        <header className='subsection-header'>
          <Link to='/columns'>
            <Icon icon='chevron-left' />
          </Link>
          <div className='text'>
            <h1>{`${texts.title} ${(item.name) ? ": '"+item.name+"'" : ''}`}</h1>
            <p>{texts.description}</p>
          </div>
        </header>
        <form className='subsection-content columned'>
          <div className='form-block'>
            <div className='row'>
              <label htmlFor='funColumnName'>Column name:</label>
              <input 
                disabled={running}
                value={this.state.name}
                onChange={this.updateState}
                onBlur={this.preformAction('name')}
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
                onChange={this.updateValue}
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
                onChange={this.updateValue}
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
                onChange={this.updateValue}
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
                onChange={this.makeSelectHandler('autoreload')}
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
                onChange={this.updateState}
                onBlur={this.preformAction('limit')}
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
                  onChange={this.makeSelectHandler('sort_pref')}
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
                  onChange={this.makeSelectHandler('sort_prop')}
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
                    onChange={this.updateValue}
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
                  'Include': 'on',
                  'Omit': 0
                }}
                onChange={this.updateValue}
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
                  'Include': 'on',
                  'Omit': 0
                }}
                onChange={this.updateValue}
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
                  'Include': 'on',
                  'Omit': 0
                }}
                onChange={this.updateValue}
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
                  'Include': 'on',
                  'Omit': 0
                }}
                onChange={this.updateValue}
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
                onChange={this.makeSelectHandler('language')}
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
                onChange={this.updateState}
                onBlur={this.preformAction('search')}
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
                onChange={this.updateState}
                onBlur={this.preformAction('url')}
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
                onChange={this.updateState}
                onBlur={this.preformAction('author')}
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
                onChange={this.updateState}
                onBlur={this.preformAction('exclude_search')}
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
                  onChange={this.updateState}
                  onBlur={this.preformAction('since')}
                  placeholder='Since...'
                  className='size-120'
                  id='funColumnSince'
                  type='text'
                  name='since'
                />
                <input 
                  disabled={running}
                  value={this.state.before}
                  onChange={this.updateState}
                  onBlur={this.preformAction('before')}
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
                    <li key={`${k}=${v}`}>{`${k}=${v}`}<span onClick={() => this.preformAction()(k, null)} ><Icon icon='cross' /></span></li>)
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
                <button onClick={this.createAdvFilter} disabled={running} className='button is-accent size-60'>Add</button>
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
  texts: {
    title: 'Edit column',
    description: 'Select the type of items to show in this column and how to display them.'
  }
}, defColumnParameters);

// Transform app state to component props
// @ deps -> Columns, Sources, Sets
// ===========================================================================
let mapStateToProps = ({ app, columns }, ownProps) => ({
  state: app.state,
  type: 'column',
  item: ensureColumnData(find(columns, {id: parseInt(ownProps.params.id)}), defColumn),
  advRegExp: /MIN|MAX|LIKE/
});

export default connect(mapStateToProps)(Edit);