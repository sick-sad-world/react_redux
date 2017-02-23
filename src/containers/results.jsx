// Import utility stuff
// ===========================================================================
import { } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Result from '../components/result';
import Icon from '../components/icon';

class Results extends React.Component {
  createResultList() {
    switch (this.props.state) {
      case 1:
        return (<li className='state-pending'>{this.props.statePending}</li>);
      case 3:
        return (
          <li className='state-loading'>
            <img src='/img/loading2.svg' />
            {this.props.stateLoading}
          </li>
        );
      case 0:
        return (
          <li className='state-error'>
            <Icon icon='error' />
            {this.props.stateError}
          </li>
        );
      case 2:
        return (this.props.payload.length) ? (this.props.payload.map((result) => {
          return (<Result key={result.hash} sort={this.props.sort} display_settings={this.props.display_settings} {...result} />)
        })) : (<li className='state-empty'>{this.props.stateEmpty}</li>);
      default:
        return null
    }
  }
  render () {
    return (
      <ul className='entity-list' onScroll={(this.props.onScroll) ? (e) => {
        e.persist();
        this.props.onScroll(e.target, this.props.payload.length);  
      } : null}>
        {this.createResultList()}
      </ul>
    );
  }
}

Results.defaultProps = {
  statePending: 'Wait a second results are in quene...',
  stateLoading: 'Content is being loaded, please stand by...',
  stateEmpty: 'It seems we could not find any items matching your query at this time. <br />Try again later or modify the filter settings for this column.',
  stateError: 'It seems there was a problem with the server.'
}

export default connect(({results}, ownProps) => {
  let result = results[ownProps.id];
  return {...result};
})(Results);