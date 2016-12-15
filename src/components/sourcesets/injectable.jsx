// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';
import { filter } from 'lodash';

// Import child components
// ===========================================================================
import Select from 'react-select';
import Icon from '../icon';
import ListItem from '../listItem';

class FeedsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      grouping: ''
    }
    this.updateState = this.updateState.bind(this);
    this.makeSelectIcon = this.makeSelectIcon.bind(this);
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
    let { sources } = this.props;
    // Define empty template
    // ===========================================================================
    let list = <li className='state-empty'></li>;
    let groupBy = [
      {value: 'sets', label: 'Sourcesets'},
      {value: 'alpha', label: 'Alphabetical'},
      {value: 'type', label: 'Source type'}
    ];

    let textRenderer = (props) => {
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

    let iteratee = (source) => {
      let data = Object.assign({}, source, {
        key: source.id,
        type: 'source',
        sortable: false,
        deletable: false,
        customIcon: this.makeSelectIcon,
        textRenderer: textRenderer,
        sourceType: source.type
      })
      return <ListItem {...data} />;
    }

    // Build up resulting list
    // ===========================================================================
    if (sources.length) {
      if (this.state.search.length > 3) {
        list = filter(sources, (item) => item.name.indexOf(this.state.search) > -1).map(iteratee);
      } else {
        list = sources.map(iteratee);
      }
    }

    return (
      <div className='list'>
        <div className='header'>
          <input type='text' name='search' defaultValue={this.state.search} onChange={this.updateState} placeholder='Search for...' />
          <Select
            name='grouping'
            searchable={false}
            options={groupBy}
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

// Transform app state to component props
// @ deps -> Sets, Sources
// ===========================================================================
export default connect(({sets, sources}) => ({sets, sources}))(FeedsList);