// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import child components
// ===========================================================================
import Select from 'react-select';

class FeedsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      grouping: ''
    }
  }

  updateState (e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render () {
    let groupBy = [
      {value: 'sets', label: 'Sourcesets'},
      {value: 'type', label: 'Source type'}
    ];

    return (
      <div className='list'>
        <div className='header'>
          <input type='text' name='search' defaultValue={this.state.search} placeholder='Search for...' />
          <Select
            name='grouping'
            options={groupBy}
            onChange={(val) => this.updateState({target: {name: 'grouping', value: val}})}
            value={this.state.grouping}
          />
        </div>
        <ul className='entity-list'></ul>
      </div>
    );
  }
}

// Transform app state to component props
// @ deps -> Sets, Sources
// ===========================================================================
export default connect(({sets, sources}) => ({sets, sources}))(FeedsList);