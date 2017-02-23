// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import Child components
// ===========================================================================
import Result from '../components/result';
import Icon from '../components/icon';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { refreshResult, ignoreResult, favoriteResult } from '../redux/results';

class Results extends React.Component {
  constructor (props) {
    super(props);
    this.makeResultAction = this.makeResultAction.bind(this);
  }
  makeResultAction(action, data) {
    return () => {
      switch (action) {
        case 'refresh':
          return this.props.refreshResult(data, {
            id: this.props.id,
            state: false
          }).catch(this.props.throwError);
        case 'ignore':
          return this.props.ignoreResult(data, {
            id: this.props.id,
            state: false
          }).catch(this.props.throwError);
        case 'favorite':
          return this.props.favoriteResult(data, {
            id: this.props.id,
            state: false
          }).catch(this.props.throwError);
      }
    }
  }

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
          return (
            <Result
              key={result.hash}
              sort={this.props.sort}
              display_settings={this.props.display_settings}
              makeAction={this.makeResultAction}
              {...result}
            />
          );
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

// Connect our Container to State
// @ deps -> Reports
// ===========================================================================
const mapStateToProps = ({results}, ownProps) => {
  let result = results[ownProps.id];
  return {...result};
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  refreshResult,
  ignoreResult,
  favoriteResult,
  errorHandler
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Results);