// Import utility stuff
// ===========================================================================
import { find, pick, bindAll, isArray } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Select from 'react-select';
import EmailList from '../sourcesets/injectable';
import Toggler from '../toggler';
import EditFormHeader from '../editHeader';

// Import actions
// ===========================================================================
import { createData, updateData, throwError } from '../../actions/actions';
import { defColumnData } from '../../reducers/defaults';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false
    }

    // Create bound actions
    // ===========================================================================
    this.actions = bindActionCreators({
      createData: createData('column'),
      updateData: updateData('column'),
      throwError: throwError
    }, this.props.dispatch);

    // Bind action handlers to component
    // ===========================================================================
    bindAll(this, ['preformAction', 'inputHandler', 'createSelectHandler']);
  }

  // Update state to hook our dropdowns
  // ===========================================================================
  componentWillReceiveProps(nextProps) {
    this.state = this.setState(pick(nextProps.item, []));
  }

  // Send request to server with new props 
  // ===========================================================================
  preformAction (data) {
    if (this.props.item.id) {
      // Modify if item is already existed
      // ===========================================================================
      this.actions.updateData(Object.assign({id: this.props.item.id}, data)).catch(this.actions.throwError);
    } else {
      // Create item if ID == 0
      // ===========================================================================
      this.actions.createData(Object.assign({}, this.props.item, data)).then(({payload}) => {
        this.props.router.push(`/${this.props.type}s/${payload.id}`);
      }).catch(this.actions.throwError);
    }
  }

  // Input handler 
  // -> Function which handles action change
  // ===========================================================================
  inputHandler(e) {
    this.preformAction({
      [e.target.name]: e.target.value
    });
  }

  // Select handler creator
  // -> Function which handles both action and state change
  // ===========================================================================
  createSelectHandler (name) {
    return (value) => {
      // Set state to update selects
      // then run change handler to send chnages to server
      // ===========================================================================
      this.setState({[name]: value}, () => {
        this.preformAction({
          [name]: (isArray(value)) ? value.map(v => v.value) : value.value
        });
      });
    }
  }

  render() {
    // Do not render at all if [ITEM] is not provided
    // ===========================================================================
    if (!this.props.item) return null;
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

    // Define autoreloading options
    // ===========================================================================
    let autoReloadOptions = [
      {label: 'Disabled', value: 0},
      {label: '15sec', value: 15},
      {label: '30sec', value: 30},
      {label: '1min', value: 60},
      {label: '2min', value: 120},
      {label: '5min', value: 300},
      {label: '10min', value: 600}
    ];


    let componentRootClass = classNames({
      'mod-subsection-edit': true,
      'state-loading': running
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
                name='frequency'
                options={autoReloadOptions}
                onChange={this.createSelectHandler('autoreload')}
                autosize={false}
                clearable={true}
                value={this.state.autoreload}
              />
            </div>
            <div className="row-flex">
              <label htmlFor="funColumnLimit">Max number of items:</label>
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
          </div>
          <div className='form-block'>
            <h4 className='form-subtitle'>Content type(s):</h4>
            <div className="row-flex">
              <span className='form-label'>Images:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_image'
                options={{
                  'Only': 1,
                  'Include': 'NaN',
                  'Omit': 0
                }}
                onChange={this.inputHandler}
                value={item.data.is_image} />
            </div>
            <div className="row-flex">
              <span className='form-label'>Videos:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_video'
                options={{
                  'Only': 1,
                  'Include': 'NaN',
                  'Omit': 0
                }}
                onChange={this.inputHandler}
                value={item.data.is_video} />
            </div>
            <div className="row-flex">
              <span className='form-label'>Facebook posts:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_facebook'
                options={{
                  'Only': 1,
                  'Include': 'NaN',
                  'Omit': 0
                }}
                onChange={this.inputHandler}
                value={item.data.is_facebook} />
            </div>
            <div className="row-flex">
              <span className='form-label'>Galleries:</span>
              <Toggler
                className='size-180'
                disabled={running}
                name='is_gallery'
                options={{
                  'Only': 1,
                  'Include': 'NaN',
                  'Omit': 0
                }}
                onChange={this.inputHandler}
                value={item.data.is_gallery} />
            </div>
            <div className="row">
              <label htmlFor="funColumnSearch">Title/description contains:</label>
              <input 
                disabled={running}
                defaultValue={item.data.search}
                onBlur={this.inputHandler}
                id='funColumnSearch'
                type='text'
                name='search'
              />
            </div>
            <div className="row">
              <label htmlFor="funColumnUrl">URL contains:</label>
              <input 
                disabled={running}
                defaultValue={item.data.url}
                onBlur={this.inputHandler}
                id='funColumnUrl'
                type='text'
                name='url'
              />
            </div>
            <div className="row">
              <label htmlFor="funColumnAuthor">Author contains:</label>
              <input 
                disabled={running}
                defaultValue={item.data.author}
                onBlur={this.inputHandler}
                id='funColumnAuthor'
                type='text'
                name='author'
              />
            </div>
            <div className="row">
              <label htmlFor="funColumnExclude">Title/description does not contain:</label>
              <input 
                disabled={running}
                defaultValue={item.data.exclude_search}
                onBlur={this.inputHandler}
                id='funColumnExclude'
                type='text'
                name='exclude_search'
              />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

// Transform app state to component props
// @ deps -> Columns, Sources, Sets
// ===========================================================================
let mapStateToProps = ({ columns, sets, sources, app }, ownProps) => {
  let item = find(columns, {id: parseInt(ownProps.params.id)});
  
  if (item) {
    item.data = Object.assign({}, defColumnData, item.data);
  }

  return {
    appState: app.appState,
    type: 'column',
    item,
    sets,
    sources
  };
};

export default connect(mapStateToProps)(Edit);