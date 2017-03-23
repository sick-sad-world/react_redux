import { bindAll, debounce, isEqual } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeResultsSelector } from '../selectors/results'

// Import Child components
// ===========================================================================
import Result from '../components/result';
import Icon from '../components/icon';

// Import actions
// ===========================================================================
import { refreshResult, ignoreResult, favoriteResult } from '../redux/results';

class Results extends React.Component {
  constructor (props) {
    super(props);
    this.infinite = false;
    this.interval = null;
    bindAll(this, 'makeResultAction', 'makeScrollHandler', 'applyScrollHandler');
    this.applyAutoReload(this.props);
    this.debouncedScrollHandler = this.makeScrollHandler();
  }

  componentWillReceiveProps(newProps) {
    this.applyAutoReload(newProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  }

  makeScrollHandler() {
    return debounce((target, offset) => {
      let { scrollTop, clientHeight, scrollHeight } = target;
      if (!this.infinite && scrollTop >= scrollHeight - clientHeight - 100 && scrollTop > 0 && scrollHeight > 0) {
        this.infinite = true;
        this.props.getResults(offset).then(() => { this.infinite = false });
      }
    }, 250);
  }

  makeResultAction(action, data) {
    return () => {
      switch (action) {
        case 'refresh':
          return this.props.refreshResult(data, {
            id: this.props.id,
            state: false
          });
        case 'ignore':
          return this.props.ignoreResult(data, {
            id: this.props.id,
            state: false
          });
        case 'favorite':
          return this.props.favoriteResult(data, {
            id: this.props.id,
            state: false
          });
      }
    }
  }

  applyAutoReload (data) {
    if (data.autoreload > 0) {
      if (data.autoreload !== this.props.autoreload) {
        clearInterval(this.interval);
        this.interval = setInterval(this.props.getResults, data.autoreload * 1000);
      }
    } else if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  applyScrollHandler () {
    if (this.props.infinite && this.props.getResults) {
      return (e) => {
        e.persist();
        this.debouncedScrollHandler(e.target, this.props.payload.length);  
      };
    }
  }

  renderResultList() {
    switch (this.props.state) {
      case 0:
        return (
          <li className='state-error'>
            <Icon icon='error' />
            {this.props.stateError}
          </li>
        );
      case 1:
        return (<li className='state-pending'>{this.props.statePending}</li>);
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
      case 3:
        return (
          <li className='state-loading'>
            <img src='/img/loading2.svg' />
            {this.props.stateLoading}
          </li>
        );
      default:
        return null
    }
  }

  render () {
    return (
      <ul className='entity-list' ref='root' onScroll={this.applyScrollHandler()}>
        {this.renderResultList()}
      </ul>
    );
  }

  componentDidUpdate () {
    if (this.refs.clientHeight) {
      this.refs.root.dispatchEvent(new Event('scroll'));
    }
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
const mapStateToProps = () => {
  const selector = makeResultsSelector();
  return (state, props) => selector(state, props);
};


const mapDispatchToProps = (dispatch) => bindActionCreators({
  refreshResult,
  ignoreResult,
  favoriteResult
}, dispatch);

export default connect(mapStateToProps(), mapDispatchToProps)(Results);