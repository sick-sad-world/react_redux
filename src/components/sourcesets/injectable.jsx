// Import React related stuff
// ===========================================================================
import React from 'React';
import { filter, includes, assign, groupBy } from 'lodash';

// Import child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';
import ListItem from '../listItem';

export default class FeedsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      grouping: ''
    }
    this.updateState = this.updateState.bind(this);
    this.makeSelectIcon = this.makeSelectIcon.bind(this);
  }

  static textRenderer (props) {
    return (<div className='text'>
      <span className='title'>
        <b>Name: </b>
        <em className='badge' data-type={props.sourceType}>{props.sourceType}</em>
        <span title={props.name}> {props.name}</span>
      </span>
      <span className='url'>
        <b>Url: </b>
        <a href={props.url} title={props.url} target='_blank'>{props.url}</a>
      </span>
    </div>);
  }
  
  updateState (e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  shouldComponentUpdate (newProps, newState) {
    let validSearch = newState.search.length > 3;
    let searchCanceled = (this.state.search.length > 3 && newState.search.length === 0);
    let groupingValid = newState.grouping !== this.state.grouping;
    return validSearch || searchCanceled || groupingValid;
  }

  makeSelectIcon(props) {
    if (this.props.selectHandler) {
      return (<a href='' onClick={e => {
        e.preventDefault();
        this.props.selectHandler({type: props.type, id: props.id})
      }} title={`Add this ${props.type} to set`}>
        <Icon icon={(props.type === 'source') ? 'reply' : 'reply-all'} />
      </a>);
    } else {
      return null;
    }
  }

  render () {
    // Gather required variables
    // ===========================================================================
    let { sources, sets, omit } = this.props;
    // Define empty template
    // ===========================================================================
    let list = <li className='state-empty'></li>;
    let groupByOptions = [
      {value: 'sets', label: 'Sourcesets'},
      {value: 'alpha', label: 'Alphabetical'},
      {value: 'type', label: 'Source type'},
      {value: 'frequency', label: 'Frequency'},
      {resourse: 'resourse', label: 'Resourse'}
    ];

    // Build up resulting list
    // ===========================================================================
    if (sources.length) {
      // Buil source list based on search state
      // ===========================================================================
      if (this.state.search.length > 3) {
        sources = filter(sources, (item) => item.name.indexOf(this.state.search) > -1);
      }
      
      list = sets.map((set) => {
        // Map sets and create List item for each except current one
        // ===========================================================================
        if (!includes(omit.set, set.id)) {
            return (<ListItem {...assign(set, {
              type: 'set',
              sortable: false,
              deletable: false,
              customIcon: this.makeSelectIcon,
            })}>
            <ul className='entity-list'>{sources.map((source) => {
              // Map through sources and pick ones that set contains
              // Create List item for each of them
              // ===========================================================================
              if (includes(set.source_ids, source.id)) {
                return (<ListItem {...assign({}, source, {
                  key: source.id,
                  type: 'source',
                  sortable: false,
                  deletable: false,
                  customIcon: this.makeSelectIcon,
                  textRenderer: this.constructor.textRenderer,
                  sourceType: source.type,
                  disabled: includes(this.props.omit.source, source.id)
                })} />);
              } else {
                return null;
              }
            })}</ul>
            </ListItem>);
        } else {
          return null;
        }
      });
    }

    return (
      <div className='list'>
        <div className='header'>
          <input type='text' name='search' defaultValue={this.state.search} onChange={this.updateState} placeholder='Search for...' />
          <Select
            name='grouping'
            searchable={false}
            options={groupByOptions}
            onChange={(val) => this.updateState({target: {name: 'grouping', value: val.value}})}
            value={this.state.grouping}
          />
        </div>
        <ul className='entity-list'>
          {list}
        </ul>
      </div>
    );
  }
}